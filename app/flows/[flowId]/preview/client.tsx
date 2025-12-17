'use client';

import Link from 'next/link';
import { useFlow } from '@/lib/flows/engine/use-flow';
import { getFlow } from '@/lib/flows/registry';
import { QuestionRenderer } from '@/lib/flows/components/question-renderer';
import { OutcomeScreen } from '@/lib/flows/components/outcome-screen';
import { ProgressBar } from '@/lib/flows/components/progress-bar';

/**
 * Preview Mode - Ephemeral Quiz Testing
 * 
 * This page allows testing a flow without:
 * - Creating database sessions
 * - Saving answers to backend
 * - Recording analytics
 * - Persisting to localStorage
 * 
 * Use case: Testing flows from the visualizer before deploying
 */
export function PreviewClient({ flowId }: { flowId: string }) {
  const flow = getFlow(flowId);

  // Flow not found
  if (!flow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Flow not found</h1>
          <p className="text-gray-600 mb-4">
            The flow &quot;{flowId}&quot; does not exist.
          </p>
          <Link
            href={`/flows/${flowId}`}
            className="text-blue-600 hover:underline"
          >
            ← Back to flow
          </Link>
        </div>
      </div>
    );
  }

  return <PreviewContent flow={flow} flowId={flowId} />;
}

function PreviewContent({
  flow,
  flowId,
}: {
  flow: NonNullable<ReturnType<typeof getFlow>>;
  flowId: string;
}) {
  const {
    currentStep,
    isOutcome,
    outcome,
    progress,
    currentAnswer,
    setCurrentAnswer,
    validationError,
    submitAnswer,
    goBack,
    canGoBack,
    isSubmitting,
    reset,
    answers,
  } = useFlow({
    flow,
    // No callbacks - completely ephemeral
    onAnswer: undefined,
    onComplete: undefined,
  });

  // Outcome screen
  if (isOutcome && outcome) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Preview Banner */}
        <PreviewBanner flowId={flowId} flowName={flow.name} answersCount={Object.keys(answers).length} />
        
        <div className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 48px)' }}>
          <div className="w-full max-w-xl">
            <OutcomeScreen outcome={outcome} onRestart={reset} />
          </div>
        </div>
      </div>
    );
  }

  // Question not found (shouldn't happen)
  if (!currentStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Step not found</h1>
          <button
            onClick={reset}
            className="text-blue-600 hover:underline"
          >
            Start over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <PreviewBanner flowId={flowId} flowName={flow.name} answersCount={Object.keys(answers).length} />

      <div className="py-8 px-4">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={`/flows/${flowId}/visualizer`}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              title="Back to visualizer"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Link>
            <span className="text-sm text-gray-500">{flow.name}</span>
          </div>

          {/* Progress */}
          <ProgressBar {...progress} />

          {/* Back button */}
          {canGoBack && (
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          )}

          {/* Question */}
          <QuestionRenderer
            step={currentStep}
            value={currentAnswer}
            onChange={setCurrentAnswer}
            onSubmit={submitAnswer}
            error={validationError}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Preview Banner Component
// ============================================================================

function PreviewBanner({ 
  flowId, 
  flowName, 
  answersCount 
}: { 
  flowId: string; 
  flowName: string;
  answersCount: number;
}) {
  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span className="text-sm font-medium">Preview Mode</span>
          <span className="text-xs opacity-75">
            — No data is being saved
          </span>
        </div>
        <div className="flex items-center gap-3">
          {answersCount > 0 && (
            <span className="text-xs opacity-75">
              {answersCount} answer{answersCount !== 1 ? 's' : ''}
            </span>
          )}
          <Link
            href={`/flows/${flowId}/visualizer`}
            className="text-xs font-medium hover:underline"
          >
            ← Visualizer
          </Link>
        </div>
      </div>
    </div>
  );
}

