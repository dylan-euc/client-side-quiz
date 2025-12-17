import { Step } from '../engine/types';
import { ComponentType } from 'react';

/**
 * Props that all question input components receive
 */
export interface QuestionInputProps<T = unknown> {
  step: Step;
  value: T | undefined;
  onChange: (value: T) => void;
  error?: string | null;
}

/**
 * Definition for a question type
 * Each question type file exports one of these
 */
export interface QuestionTypeDefinition {
  /** The type key (must match StepType in engine/types.ts) */
  type: string;
  /** Human-readable name */
  name: string;
  /** Brief description of what this type does */
  description: string;
  /** Tailwind classes for badge styling */
  color: string;
  /** The React component that renders this input */
  component: ComponentType<QuestionInputProps<unknown>>;
  /** Example step for previews */
  example: Step;
}

