'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Date Question Type
// Date picker input
// ============================================================================

interface DateInputProps {
  step: Step;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string | null;
}

function DateInput({ step, value, onChange, error }: DateInputProps) {
  return (
    <div>
      <input
        type="date"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
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

export const dateType: QuestionTypeDefinition = {
  type: 'date',
  name: 'Date',
  description: 'Date picker input',
  color: questionTypeColors.date.badgeFull,
  component: DateInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-date',
    type: 'date',
    shortcode: 'patient_dob',
    question: 'What is your date of birth?',
    description: 'We need this to verify your eligibility.',
    validation: { required: true },
    next: 'next-step',
  },
};

