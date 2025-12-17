'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Number Question Type
// Numeric input with optional min/max validation
// ============================================================================

interface NumberInputProps {
  step: Step;
  value: number | undefined;
  onChange: (value: number) => void;
  error?: string | null;
}

function NumberInput({ step, value, onChange, error }: NumberInputProps) {
  const { min, max } = step.validation ?? {};

  return (
    <div>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => {
          const val = e.target.value;
          if (val === '') {
            onChange(undefined as unknown as number);
          } else {
            onChange(Number(val));
          }
        }}
        placeholder={step.placeholder || 'Enter a number'}
        min={min}
        max={max}
        className={`
          w-full px-4 py-3 rounded-lg border transition-colors
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
        `}
      />
      {(min !== undefined || max !== undefined) && (
        <p className="mt-2 text-sm text-gray-500">
          Enter a number{min !== undefined ? ` between ${min}` : ''}
          {max !== undefined ? ` and ${max}` : ''}
        </p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export const numberType: QuestionTypeDefinition = {
  type: 'number',
  name: 'Number',
  description: 'Numeric input with validation',
  color: questionTypeColors.number.badgeFull,
  component: NumberInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-number',
    type: 'number',
    shortcode: 'current_weight_kg',
    question: 'What is your current weight?',
    description: 'Enter your weight in kilograms.',
    placeholder: '75',
    validation: { required: true, min: 30, max: 300 },
    next: 'next-step',
  },
};

