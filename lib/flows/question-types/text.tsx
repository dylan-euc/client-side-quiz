'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Text Question Type
// Free-form text input (single or multi-line)
// ============================================================================

interface TextInputProps {
  step: Step;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string | null;
}

function TextInput({ step, value, onChange, error }: TextInputProps) {
  return (
    <div>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={step.placeholder || 'Type your answer...'}
        className={`
          w-full px-4 py-3 rounded-lg border transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
        `}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export const textType: QuestionTypeDefinition = {
  type: 'text',
  name: 'Text',
  description: 'Free-form text input',
  color: questionTypeColors.text.badgeFull,
  component: TextInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-text',
    type: 'text',
    shortcode: 'full_name',
    question: 'What is your full name?',
    description: 'Please enter your name as it appears on official documents.',
    placeholder: 'John Smith',
    validation: { required: true, minLength: 2 },
    next: 'next-step',
  },
};

