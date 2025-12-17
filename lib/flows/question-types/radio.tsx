'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Radio Question Type
// Single select from a list of options
// ============================================================================

interface RadioInputProps {
  step: Step;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string | null;
}

function RadioInput({ step, value, onChange, error }: RadioInputProps) {
  const options = step.options ?? [];

  return (
    <div>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start p-4 rounded-lg border cursor-pointer transition-all
              ${
                value === option.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name={step.id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="ml-3">
              <span className="block font-medium text-gray-900">{option.label}</span>
              {option.description && (
                <span className="block text-sm text-gray-500 mt-1">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export const radioType: QuestionTypeDefinition = {
  type: 'radio',
  name: 'Radio',
  description: 'Single select from a list of options',
  color: questionTypeColors.radio.badgeFull,
  component: RadioInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-radio',
    type: 'radio',
    question: 'What is your primary goal?',
    description: 'Select the option that best describes your main objective.',
    options: [
      { label: 'Lose weight', value: 'lose-weight' },
      { label: 'Build muscle', value: 'build-muscle' },
      { label: 'Improve fitness', value: 'improve-fitness' },
      { label: 'Better sleep', value: 'better-sleep' },
    ],
    next: 'next-step',
  },
};

