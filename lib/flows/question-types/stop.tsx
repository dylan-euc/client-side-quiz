'use client';

import { Step } from '../engine/types';
import { QuestionTypeDefinition } from './types';
import { questionTypeColors } from './colors';

// ============================================================================
// Stop Question Type
// Terminal screen - quiz cannot continue
// No navigation, no input - user has reached an endpoint
// ============================================================================

interface StopInputProps {
  step: Step;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string | null;
}

function StopInput({ step }: StopInputProps) {
  return (
    <div className="text-center py-4">
      {/* Stop icon */}
      <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* The question text becomes the title for stop screens */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        {step.question}
      </h2>

      {/* Description provides more context */}
      {step.description && (
        <p className="text-gray-600 leading-relaxed max-w-md mx-auto">
          {step.description}
        </p>
      )}

      {/* No button - this is a terminal state */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-500">
          This assessment cannot continue based on your responses.
        </p>
      </div>
    </div>
  );
}

export const stopType: QuestionTypeDefinition = {
  type: 'stop',
  name: 'Stop',
  description: 'Terminal screen - quiz cannot continue',
  color: questionTypeColors.stop.badgeFull,
  component: StopInput as QuestionTypeDefinition['component'],
  example: {
    id: 'example-stop',
    type: 'stop',
    question: 'We\'re unable to proceed with your application',
    description: 'Based on your responses, our program may not be suitable for you at this time. We recommend consulting with your healthcare provider for personalized advice.',
    next: '', // Stop types don't navigate anywhere
  },
};

