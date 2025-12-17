'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Checkbox Question Type
// Multi-select from a list of options
// ============================================================================

interface CheckboxInputProps {
  step: Step;
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  error?: string | null;
}

function CheckboxInput({ step, value, onChange, error }: CheckboxInputProps) {
  const options = step.options ?? [];
  const selected = value ?? [];

  const toggleOption = (optionValue: string) => {
    if (selected.includes(optionValue)) {
      onChange(selected.filter((v) => v !== optionValue));
    } else {
      onChange([...selected, optionValue]);
    }
  };

  return (
    <div>
      <div className="space-y-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-start p-4 rounded-lg border cursor-pointer transition-all
              ${
                selected.includes(option.value)
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={selected.includes(option.value)}
              onChange={() => toggleOption(option.value)}
              className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

export const checkboxType: QuestionTypeDefinition = {
  type: 'checkbox',
  name: 'Checkbox',
  description: 'Multi-select from a list of options',
  color: questionTypeColors.checkbox.badgeFull,
  component: CheckboxInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-checkbox',
    type: 'checkbox',
    question: 'Which of these apply to you?',
    description: 'Select all that apply.',
    options: [
      { label: 'I exercise regularly', value: 'exercise' },
      { label: 'I eat a balanced diet', value: 'diet' },
      { label: 'I get enough sleep', value: 'sleep' },
      { label: 'I manage stress well', value: 'stress' },
    ],
    validation: { required: true },
    next: 'next-step',
  },
};

