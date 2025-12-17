/**
 * Question Type Metadata
 * 
 * This file contains just the metadata for question types (no React components).
 * Safe to import in Server Components.
 * 
 * Colors are derived from the centralized colors.ts file.
 */

import { questionTypeColors } from './colors';

export interface QuestionTypeMeta {
  type: string;
  name: string;
  description: string;
  color: string;
}

/**
 * Metadata definitions for all question types.
 * Colors are pulled from the centralized color mapping.
 */
export const questionTypeMeta: QuestionTypeMeta[] = [
  {
    type: 'radio',
    name: 'Radio',
    description: 'Single select from a list of options',
    color: questionTypeColors.radio.badgeFull,
  },
  {
    type: 'checkbox',
    name: 'Checkbox',
    description: 'Multi-select from a list of options',
    color: questionTypeColors.checkbox.badgeFull,
  },
  {
    type: 'text',
    name: 'Text',
    description: 'Free-form text input',
    color: questionTypeColors.text.badgeFull,
  },
  {
    type: 'number',
    name: 'Number',
    description: 'Numeric input with validation',
    color: questionTypeColors.number.badgeFull,
  },
  {
    type: 'date',
    name: 'Date',
    description: 'Date picker input',
    color: questionTypeColors.date.badgeFull,
  },
  {
    type: 'email',
    name: 'Email',
    description: 'Email input with validation',
    color: questionTypeColors.email.badgeFull,
  },
  {
    type: 'dropdown',
    name: 'Dropdown',
    description: 'Select dropdown for long option lists',
    color: questionTypeColors.dropdown.badgeFull,
  },
  {
    type: 'info',
    name: 'Info',
    description: 'Informational screen (no input)',
    color: questionTypeColors.info.badgeFull,
  },
  {
    type: 'stop',
    name: 'Stop',
    description: 'Terminal screen - quiz cannot continue',
    color: questionTypeColors.stop.badgeFull,
  },
];

