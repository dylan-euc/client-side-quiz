import { Condition, ValueCondition, Branch, NextLogic } from './types';

// ============================================================================
// Condition Evaluator
// ============================================================================

/**
 * Check if an object is a ValueCondition (not an AnswerCondition or combinator)
 */
function isValueCondition(condition: Condition): condition is ValueCondition {
  return (
    'equals' in condition ||
    'notEquals' in condition ||
    'includes' in condition ||
    'notIncludes' in condition ||
    'gt' in condition ||
    'gte' in condition ||
    'lt' in condition ||
    'lte' in condition ||
    'matches' in condition ||
    'isEmpty' in condition ||
    'isNotEmpty' in condition
  );
}

/**
 * Evaluate a value condition against a value
 */
function evaluateValueCondition(condition: ValueCondition, value: unknown): boolean {
  if ('equals' in condition) {
    return value === condition.equals;
  }
  if ('notEquals' in condition) {
    return value !== condition.notEquals;
  }
  if ('includes' in condition) {
    return Array.isArray(value) && value.includes(condition.includes);
  }
  if ('notIncludes' in condition) {
    return Array.isArray(value) && !value.includes(condition.notIncludes);
  }
  if ('gt' in condition) {
    return typeof value === 'number' && value > condition.gt;
  }
  if ('gte' in condition) {
    return typeof value === 'number' && value >= condition.gte;
  }
  if ('lt' in condition) {
    return typeof value === 'number' && value < condition.lt;
  }
  if ('lte' in condition) {
    return typeof value === 'number' && value <= condition.lte;
  }
  if ('matches' in condition) {
    if (typeof value !== 'string') return false;
    const regex = new RegExp(condition.matches);
    return regex.test(value);
  }
  if ('isEmpty' in condition) {
    if (value === undefined || value === null || value === '') return true;
    if (Array.isArray(value)) return value.length === 0;
    return false;
  }
  if ('isNotEmpty' in condition) {
    if (value === undefined || value === null || value === '') return false;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }
  return false;
}

/**
 * Evaluate a condition against the current answer and all answers
 */
export function evaluateCondition(
  condition: Condition,
  currentValue: unknown,
  allAnswers: Record<string, unknown>
): boolean {
  // Handle combinators
  if ('and' in condition) {
    return condition.and.every((c) => evaluateCondition(c, currentValue, allAnswers));
  }
  if ('or' in condition) {
    return condition.or.some((c) => evaluateCondition(c, currentValue, allAnswers));
  }
  if ('not' in condition) {
    return !evaluateCondition(condition.not, currentValue, allAnswers);
  }

  // Handle answer reference (cross-question condition)
  if ('answer' in condition) {
    const referencedValue = allAnswers[condition.answer];
    // Extract the value condition part (everything except 'answer')
    const { answer: _, ...valueCondition } = condition;
    return evaluateValueCondition(valueCondition as ValueCondition, referencedValue);
  }

  // Handle direct value condition
  if (isValueCondition(condition)) {
    return evaluateValueCondition(condition, currentValue);
  }

  return false;
}

/**
 * Evaluate branch logic and return the next step ID
 */
export function evaluateNextLogic(
  next: NextLogic,
  currentValue: unknown,
  allAnswers: Record<string, unknown>
): string {
  // Simple string - always go to this step
  if (typeof next === 'string') {
    return next;
  }

  // Branch array - evaluate conditions in order
  for (const branch of next) {
    if ('default' in branch) {
      return branch.default;
    }
    if ('when' in branch) {
      if (evaluateCondition(branch.when, currentValue, allAnswers)) {
        return branch.then;
      }
    }
  }

  // Should never reach here if branches are well-formed (always have default)
  throw new Error('No matching branch found and no default specified');
}

/**
 * Extract all possible target step IDs from next logic
 * Useful for visualization and validation
 */
export function extractTargets(next: NextLogic): string[] {
  if (typeof next === 'string') {
    return [next];
  }

  return next.map((branch) => {
    if ('default' in branch) {
      return branch.default;
    }
    return branch.then;
  });
}

/**
 * Check if next logic has branching (is not a simple string)
 */
export function hasBranching(next: NextLogic): next is Branch[] {
  return Array.isArray(next);
}

// ============================================================================
// Condition to Label (for visualization)
// ============================================================================

/**
 * Convert a value condition to a human-readable label
 */
function valueConditionToLabel(condition: ValueCondition): string {
  if ('equals' in condition) {
    const val = typeof condition.equals === 'string' ? `"${condition.equals}"` : condition.equals;
    return `= ${val}`;
  }
  if ('notEquals' in condition) {
    const val = typeof condition.notEquals === 'string' ? `"${condition.notEquals}"` : condition.notEquals;
    return `≠ ${val}`;
  }
  if ('includes' in condition) {
    return `includes "${condition.includes}"`;
  }
  if ('notIncludes' in condition) {
    return `excludes "${condition.notIncludes}"`;
  }
  if ('gt' in condition) {
    return `> ${condition.gt}`;
  }
  if ('gte' in condition) {
    return `≥ ${condition.gte}`;
  }
  if ('lt' in condition) {
    return `< ${condition.lt}`;
  }
  if ('lte' in condition) {
    return `≤ ${condition.lte}`;
  }
  if ('matches' in condition) {
    return `matches /${condition.matches}/`;
  }
  if ('isEmpty' in condition) {
    return 'is empty';
  }
  if ('isNotEmpty' in condition) {
    return 'is not empty';
  }
  return '?';
}

/**
 * Convert a condition to a human-readable label for visualization
 */
export function conditionToLabel(condition: Condition): string {
  // Handle combinators
  if ('and' in condition) {
    const parts = condition.and.map(conditionToLabel);
    return parts.length <= 2 ? parts.join(' AND ') : `AND(${parts.length})`;
  }
  if ('or' in condition) {
    const parts = condition.or.map(conditionToLabel);
    return parts.length <= 2 ? parts.join(' OR ') : `OR(${parts.length})`;
  }
  if ('not' in condition) {
    return `NOT ${conditionToLabel(condition.not)}`;
  }

  // Handle answer reference (cross-question condition)
  if ('answer' in condition) {
    const { answer, ...valueCondition } = condition;
    const valueLabel = valueConditionToLabel(valueCondition as ValueCondition);
    return `${answer} ${valueLabel}`;
  }

  // Handle direct value condition
  if (isValueCondition(condition)) {
    return valueConditionToLabel(condition);
  }

  return '?';
}

/**
 * Get a label for a branch (either the condition label or "default")
 */
export function branchToLabel(branch: Branch): string {
  if ('default' in branch) {
    return 'default';
  }
  return conditionToLabel(branch.when);
}

