'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Dropdown Question Type
// Select dropdown for long option lists
// ============================================================================

interface DropdownInputProps {
  step: Step;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string | null;
}

function DropdownInput({ step, value, onChange, error }: DropdownInputProps) {
  const options = step.options ?? [];
  const inputValue = value ?? '';

  return (
    <div>
      <div className="relative">
        <select
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full py-3 px-4 pr-10 border rounded-lg text-gray-900 bg-white
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
            ${!inputValue ? 'text-gray-500' : 'text-gray-900'}
          `}
        >
          <option value="" disabled>
            {step.placeholder ?? 'Select an option...'}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Selected option description */}
      {inputValue && options.find(o => o.value === inputValue)?.description && (
        <p className="mt-2 text-sm text-gray-600">
          {options.find(o => o.value === inputValue)?.description}
        </p>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export const dropdownType: QuestionTypeDefinition = {
  type: 'dropdown',
  name: 'Dropdown',
  description: 'Select dropdown for long option lists',
  color: questionTypeColors.dropdown.badgeFull,
  component: DropdownInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-dropdown',
    type: 'dropdown',
    question: 'Which country do you live in?',
    description: 'This helps us determine which services are available in your region.',
    placeholder: 'Select your country...',
    options: [
      { value: 'au', label: 'Australia' },
      { value: 'uk', label: 'United Kingdom' },
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'nz', label: 'New Zealand' },
      { value: 'ie', label: 'Ireland' },
      { value: 'sg', label: 'Singapore' },
      { value: 'hk', label: 'Hong Kong' },
      { value: 'jp', label: 'Japan' },
      { value: 'other', label: 'Other', description: 'We may have limited services in your region' },
    ],
    validation: { required: true },
    next: 'next-step',
  },
};

