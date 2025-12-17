'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Email Question Type
// Email input with built-in validation
// ============================================================================

interface EmailInputProps {
  step: Step;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string | null;
}

// RFC 5322 compliant email regex (simplified but robust)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EmailInput({ step, value, onChange, error }: EmailInputProps) {
  const inputValue = value ?? '';
  const isValidFormat = inputValue === '' || EMAIL_REGEX.test(inputValue);

  return (
    <div>
      <div className="relative">
        {/* Email icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder={step.placeholder ?? 'you@example.com'}
          className={`
            w-full pl-10 pr-10 py-3 border rounded-lg text-gray-900 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error || (!isValidFormat && inputValue) 
              ? 'border-red-300 bg-red-50' 
              : 'border-gray-300 bg-white'
            }
          `}
        />

        {/* Validation indicator */}
        {inputValue && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {isValidFormat ? (
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Error messages */}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {!isValidFormat && inputValue && !error && (
        <p className="mt-2 text-sm text-red-600">Please enter a valid email address</p>
      )}
    </div>
  );
}

export const emailType: QuestionTypeDefinition = {
  type: 'email',
  name: 'Email',
  description: 'Email input with validation',
  color: questionTypeColors.email.badgeFull,
  component: EmailInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-email',
    type: 'email',
    question: 'What is your email address?',
    description: 'We\'ll use this to send you important updates about your application.',
    placeholder: 'you@example.com',
    validation: { required: true },
    next: 'next-step',
  },
};

