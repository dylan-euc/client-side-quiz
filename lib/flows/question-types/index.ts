/**
 * Question Types Registry
 * 
 * Each question type is defined in its own file:
 * - radio.tsx    → Single select from options
 * - checkbox.tsx → Multi-select from options
 * - text.tsx     → Free-form text input
 * - number.tsx   → Numeric input
 * - date.tsx     → Date picker
 * - info.tsx     → Informational screen (no input)
 * 
 * To add a new question type:
 * 1. Create a new file (e.g., email.tsx)
 * 2. Export a QuestionTypeDefinition
 * 3. Import and add it to this index
 * 4. Add the type to StepType in engine/types.ts
 */

import { QuestionTypeDefinition } from './types';
import { radioType } from './radio';
import { checkboxType } from './checkbox';
import { textType } from './text';
import { numberType } from './number';
import { dateType } from './date';
import { emailType } from './email';
import { dropdownType } from './dropdown';
import { infoType } from './info';
import { stopType } from './stop';

// All question types, keyed by type string
export const questionTypes: Record<string, QuestionTypeDefinition> = {
  radio: radioType,
  checkbox: checkboxType,
  text: textType,
  number: numberType,
  date: dateType,
  email: emailType,
  dropdown: dropdownType,
  info: infoType,
  stop: stopType,
};

// Array of all types (useful for listing)
export const allQuestionTypes: QuestionTypeDefinition[] = Object.values(questionTypes);

// Get a question type by key
export function getQuestionType(type: string): QuestionTypeDefinition | undefined {
  return questionTypes[type];
}

// Re-export types
export type { QuestionTypeDefinition, QuestionInputProps } from './types';

// Re-export metadata (safe for Server Components)
export { questionTypeMeta } from './metadata';
export type { QuestionTypeMeta } from './metadata';

// Re-export colors (centralized color mappings)
export { questionTypeColors, getTypeColors, defaultColors } from './colors';
export type { QuestionTypeColors } from './colors';

// Re-export individual types for direct access
export { radioType } from './radio';
export { checkboxType } from './checkbox';
export { textType } from './text';
export { numberType } from './number';
export { dateType } from './date';
export { emailType } from './email';
export { dropdownType } from './dropdown';
export { infoType } from './info';
export { stopType } from './stop';

