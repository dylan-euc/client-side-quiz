'use client';

import { useState, useCallback, useMemo } from 'react';
import { FlowDefinition, Step, Outcome, validateAnswer } from './types';
import { evaluateNextLogic } from './conditions';

// ============================================================================
// Types
// ============================================================================

export interface UseFlowOptions {
  /** The flow definition to use */
  flow: FlowDefinition;
  /** Optional initial answers (for resuming) */
  initialAnswers?: Record<string, unknown>;
  /** Optional initial step (for resuming) */
  initialStep?: string;
  /** Callback when an answer is submitted */
  onAnswer?: (stepId: string, shortcode: string | undefined, value: unknown) => Promise<void>;
  /** Callback when the flow is completed */
  onComplete?: (outcomeId: string) => Promise<void>;
}

export interface UseFlowReturn {
  /** The current step definition (null if on an outcome) */
  currentStep: Step | null;
  /** The current step ID */
  currentStepId: string;
  /** All answers collected so far */
  answers: Record<string, unknown>;
  /** Navigation history (step IDs) */
  history: string[];
  /** Whether the current step is an outcome */
  isOutcome: boolean;
  /** The outcome if on an outcome step */
  outcome: Outcome | null;
  /** Progress information */
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  /** Current answer value (for controlled inputs) */
  currentAnswer: unknown;
  /** Set the current answer value */
  setCurrentAnswer: (value: unknown) => void;
  /** Validation error for current answer */
  validationError: string | null;
  /** Submit the current answer and move to next step */
  submitAnswer: () => Promise<void>;
  /** Go back to the previous step */
  goBack: () => void;
  /** Whether we can go back */
  canGoBack: boolean;
  /** Whether submission is in progress */
  isSubmitting: boolean;
  /** Reset the flow to the beginning (clear all answers and history) */
  reset: () => void;
}

// ============================================================================
// Hook
// ============================================================================

export function useFlow({
  flow,
  initialAnswers = {},
  initialStep,
  onAnswer,
  onComplete,
}: UseFlowOptions): UseFlowReturn {
  // Determine starting step
  const startStep = initialStep || flow.initialStep;

  // State
  const [currentStepId, setCurrentStepId] = useState<string>(startStep);
  const [answers, setAnswers] = useState<Record<string, unknown>>(initialAnswers);
  const [history, setHistory] = useState<string[]>([startStep]);
  const [currentAnswer, setCurrentAnswer] = useState<unknown>(
    initialAnswers[startStep] ?? undefined
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived state
  const isOutcome = currentStepId.startsWith('outcome:');
  const currentStep = useMemo(
    () => flow.steps.find((s) => s.id === currentStepId) ?? null,
    [flow.steps, currentStepId]
  );
  const outcome = isOutcome ? flow.outcomes[currentStepId] ?? null : null;

  // Progress calculation
  const progress = useMemo(() => {
    const stepsAnswered = Object.keys(answers).length;
    const totalSteps = flow.steps.filter((s) => s.type !== 'info').length;
    return {
      current: stepsAnswered,
      total: totalSteps,
      percentage: totalSteps > 0 ? Math.round((stepsAnswered / totalSteps) * 100) : 0,
    };
  }, [answers, flow.steps]);

  // Calculate next step ID using declarative conditions
  const getNextStepId = useCallback(
    (value: unknown, currentAnswers: Record<string, unknown>): string => {
      if (!currentStep) return currentStepId;
      return evaluateNextLogic(currentStep.next, value, currentAnswers);
    },
    [currentStep, currentStepId]
  );

  // Submit answer
  const submitAnswer = useCallback(async () => {
    if (!currentStep || isOutcome) return;

    // For info steps, don't validate or save - just move on
    if (currentStep.type === 'info') {
      const nextStepId = getNextStepId(undefined, answers);

      // Check if outcome
      if (nextStepId.startsWith('outcome:') && onComplete) {
        setIsSubmitting(true);
        try {
          await onComplete(nextStepId);
        } finally {
          setIsSubmitting(false);
        }
      }

      setHistory((prev) => [...prev, nextStepId]);
      setCurrentStepId(nextStepId);
      setCurrentAnswer(answers[nextStepId] ?? undefined);
      setValidationError(null);
      return;
    }

    // Validate
    const validation = validateAnswer(currentAnswer, currentStep);
    if (!validation.valid) {
      setValidationError(validation.error ?? 'Invalid input');
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      // Save answer
      const newAnswers = { ...answers, [currentStep.id]: currentAnswer };
      setAnswers(newAnswers);

      // Persist to backend
      if (onAnswer) {
        await onAnswer(currentStep.id, currentStep.shortcode, currentAnswer);
      }

      // Calculate next step
      const nextStepId = getNextStepId(currentAnswer, newAnswers);

      // Check if outcome
      if (nextStepId.startsWith('outcome:') && onComplete) {
        await onComplete(nextStepId);
      }

      setHistory((prev) => [...prev, nextStepId]);
      setCurrentStepId(nextStepId);
      setCurrentAnswer(newAnswers[nextStepId] ?? undefined);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentStep,
    currentAnswer,
    answers,
    isOutcome,
    getNextStepId,
    onAnswer,
    onComplete,
  ]);

  // Go back
  const goBack = useCallback(() => {
    if (history.length <= 1) return;

    const newHistory = history.slice(0, -1);
    const previousStepId = newHistory[newHistory.length - 1];

    setHistory(newHistory);
    setCurrentStepId(previousStepId);
    setCurrentAnswer(answers[previousStepId] ?? undefined);
    setValidationError(null);
  }, [history, answers]);

  // Reset to beginning
  const reset = useCallback(() => {
    setCurrentStepId(startStep);
    setAnswers({});
    setHistory([startStep]);
    setCurrentAnswer(undefined);
    setValidationError(null);
    setIsSubmitting(false);
  }, [startStep]);

  return {
    currentStep,
    currentStepId,
    answers,
    history,
    isOutcome,
    outcome,
    progress,
    currentAnswer,
    setCurrentAnswer,
    validationError,
    submitAnswer,
    goBack,
    canGoBack: history.length > 1 && !isOutcome,
    isSubmitting,
    reset,
  };
}

