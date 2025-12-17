import { Shortcode } from '../shortcodes';

// ============================================================================
// Step Types
// ============================================================================

export type StepType =
  | 'text' // Free text input
  | 'number' // Numeric input
  | 'radio' // Single select
  | 'checkbox' // Multi select
  | 'date' // Date picker
  | 'email' // Email input with validation
  | 'dropdown' // Select dropdown for long lists
  | 'info' // Informational screen (no input)
  | 'stop'; // Terminal screen - quiz cannot continue

// ============================================================================
// Step Options (for radio/checkbox)
// ============================================================================

export interface StepOption {
  value: string;
  label: string;
  description?: string;
}

// ============================================================================
// Help Text / Popups
// ============================================================================

export interface HelpText {
  /** Title for the help popup (optional) */
  title?: string;
  /** Content to display - can include markdown */
  content: string;
  /** Optional link text (e.g., "Learn more") */
  linkText?: string;
}

// ============================================================================
// Validation Rules
// ============================================================================

export interface ValidationRules {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string; // Regex pattern as string
  customMessage?: string;
}

// ============================================================================
// Condition System (Declarative Branching Logic)
// ============================================================================

/**
 * Value conditions - operate on the current answer value
 */
export type ValueCondition =
  | { equals: unknown }
  | { notEquals: unknown }
  | { includes: string }      // For arrays (checkbox): array.includes(value)
  | { notIncludes: string }   // For arrays: !array.includes(value)
  | { gt: number }            // Greater than
  | { gte: number }           // Greater than or equal
  | { lt: number }            // Less than
  | { lte: number }           // Less than or equal
  | { matches: string }       // Regex pattern
  | { isEmpty: true }
  | { isNotEmpty: true };

/**
 * Answer condition - reference another step's answer
 */
export type AnswerCondition = {
  answer: string;  // Step ID to reference
} & ValueCondition;

/**
 * Full condition type with combinators
 */
export type Condition =
  | ValueCondition
  | AnswerCondition
  | { and: Condition[] }
  | { or: Condition[] }
  | { not: Condition };

/**
 * Branch definition for conditional routing
 */
export type Branch =
  | { when: Condition; then: string }
  | { default: string };

/**
 * Next step logic - either a static string or an array of branches
 */
export type NextLogic = string | Branch[];

// ============================================================================
// Step Definition
// ============================================================================

export interface Step {
  /** Unique identifier for this step */
  id: string;
  /** Type of input to render */
  type: StepType;
  /** Shortcode for backend/clinical mapping (must be defined in shortcodes.ts) */
  shortcode?: Shortcode;
  /** The question text to display */
  question: string;
  /** Optional description/helper text */
  description?: string;
  /** Placeholder text for text/number inputs */
  placeholder?: string;
  /** Options for radio/checkbox/dropdown types */
  options?: StepOption[];
  /** Validation rules */
  validation?: ValidationRules;
  /** 
   * Help text popup - appears as a "?" icon next to the question
   * Use for "Why are we asking this?" explanations
   */
  helpText?: HelpText;
  /** 
   * Next step to navigate to.
   * - Static string: Always go to this step/outcome (e.g., 'weight', 'outcome:eligible')
   * - Branch array: Evaluate conditions in order, first match wins
   * Outcome IDs should be prefixed with 'outcome:' (e.g., 'outcome:eligible')
   */
  next: NextLogic;
}

// ============================================================================
// Outcome Definition
// ============================================================================

export type OutcomeType = 'eligible' | 'ineligible' | 'needs-review';

export interface Outcome {
  type: OutcomeType;
  reason?: string;
  message?: string;
}

// ============================================================================
// Flow Definition
// ============================================================================

export interface FlowDefinition {
  /** Unique identifier for this flow */
  id: string;
  /** Human-readable name */
  name: string;
  /** Semantic version (e.g., '1.0.0') */
  version: string;
  /** Optional description */
  description?: string;
  /** All steps in this flow */
  steps: Step[];
  /** Possible outcomes (keyed by outcome ID, e.g., 'outcome:eligible') */
  outcomes: Record<string, Outcome>;
  /** The ID of the first step */
  initialStep: string;
}

// ============================================================================
// Helper Function
// ============================================================================

/**
 * Flow validation error
 */
export class FlowValidationError extends Error {
  constructor(message: string, public flowId: string) {
    super(`Flow "${flowId}": ${message}`);
    this.name = 'FlowValidationError';
  }
}

/**
 * Extract all possible target step IDs from next logic.
 * Used for validation.
 */
function extractNextTargets(next: NextLogic): string[] {
  if (typeof next === 'string') {
    return next ? [next] : [];
  }
  return next.map((branch) => {
    if ('default' in branch) {
      return branch.default;
    }
    return branch.then;
  }).filter(Boolean);
}

/**
 * Type-safe helper to define a flow with runtime validation.
 * Validates:
 * - initialStep exists in steps
 * - All next targets reference valid steps or outcomes
 * - All referenced outcomes exist
 * - Branch arrays have default as last item (if present)
 */
export function defineFlow(flow: FlowDefinition): FlowDefinition {
  const stepIds = new Set(flow.steps.map((s) => s.id));
  const outcomeIds = new Set(Object.keys(flow.outcomes));

  // Validate initialStep exists
  if (!stepIds.has(flow.initialStep)) {
    throw new FlowValidationError(
      `Initial step "${flow.initialStep}" not found in steps`,
      flow.id
    );
  }

  // Validate each step's next targets
  for (const step of flow.steps) {
    const targets = extractNextTargets(step.next);
    
    for (const target of targets) {
      const isOutcome = target.startsWith('outcome:');
      
      if (isOutcome) {
        if (!outcomeIds.has(target)) {
          throw new FlowValidationError(
            `Step "${step.id}" references unknown outcome "${target}"`,
            flow.id
          );
        }
      } else {
        if (!stepIds.has(target)) {
          throw new FlowValidationError(
            `Step "${step.id}" references unknown step "${target}"`,
            flow.id
          );
        }
      }
    }

    // Validate branch ordering: default should be last
    if (Array.isArray(step.next) && step.next.length > 0) {
      const defaultIndex = step.next.findIndex((b) => 'default' in b);
      if (defaultIndex !== -1 && defaultIndex !== step.next.length - 1) {
        throw new FlowValidationError(
          `Step "${step.id}" has 'default' branch not at the end. Default must be last.`,
          flow.id
        );
      }
    }
  }

  // Validate step IDs are unique
  if (stepIds.size !== flow.steps.length) {
    const seen = new Set<string>();
    for (const step of flow.steps) {
      if (seen.has(step.id)) {
        throw new FlowValidationError(
          `Duplicate step ID "${step.id}"`,
          flow.id
        );
      }
      seen.add(step.id);
    }
  }

  return flow;
}

// ============================================================================
// Validation Helper
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateAnswer(
  value: unknown,
  step: Step
): ValidationResult {
  const rules = step.validation;

  // No validation rules = always valid
  if (!rules) {
    return { valid: true };
  }

  // Required check
  if (rules.required) {
    if (value === undefined || value === null || value === '') {
      return {
        valid: false,
        error: rules.customMessage || 'This field is required',
      };
    }
    // For checkbox (array), check if at least one selected
    if (Array.isArray(value) && value.length === 0) {
      return {
        valid: false,
        error: rules.customMessage || 'Please select at least one option',
      };
    }
  }

  // Number validations
  if (typeof value === 'number') {
    if (rules.min !== undefined && value < rules.min) {
      return {
        valid: false,
        error: rules.customMessage || `Value must be at least ${rules.min}`,
      };
    }
    if (rules.max !== undefined && value > rules.max) {
      return {
        valid: false,
        error: rules.customMessage || `Value must be at most ${rules.max}`,
      };
    }
  }

  // String validations
  if (typeof value === 'string') {
    if (rules.minLength !== undefined && value.length < rules.minLength) {
      return {
        valid: false,
        error: rules.customMessage || `Must be at least ${rules.minLength} characters`,
      };
    }
    if (rules.maxLength !== undefined && value.length > rules.maxLength) {
      return {
        valid: false,
        error: rules.customMessage || `Must be at most ${rules.maxLength} characters`,
      };
    }
    if (rules.pattern) {
      const regex = new RegExp(rules.pattern);
      if (!regex.test(value)) {
        return {
          valid: false,
          error: rules.customMessage || 'Invalid format',
        };
      }
    }
  }

  return { valid: true };
}

