'use client';

import { Outcome } from '../engine/types';

interface OutcomeScreenProps {
  outcome: Outcome;
  onRestart?: () => void;
}

export function OutcomeScreen({ outcome, onRestart }: OutcomeScreenProps) {
  const isEligible = outcome.type === 'eligible';
  const needsReview = outcome.type === 'needs-review';

  return (
    <div className="max-w-md mx-auto text-center py-8">
      {/* Icon */}
      <div
        className={`
          mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6
          ${isEligible ? 'bg-green-100' : needsReview ? 'bg-yellow-100' : 'bg-red-100'}
        `}
      >
        {isEligible ? (
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : needsReview ? (
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </div>

      {/* Title */}
      <h2
        className={`
          text-2xl font-semibold mb-4
          ${isEligible ? 'text-green-900' : needsReview ? 'text-yellow-900' : 'text-red-900'}
        `}
      >
        {isEligible
          ? 'You may be eligible!'
          : needsReview
          ? 'Additional review needed'
          : 'Not eligible at this time'}
      </h2>

      {/* Message */}
      {outcome.message && (
        <p className="text-gray-600 leading-relaxed mb-8">{outcome.message}</p>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {isEligible && (
          <button
            className="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg 
                       hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 
                       focus:ring-offset-2 transition-colors"
          >
            Continue to next steps
          </button>
        )}

        {onRestart && (
          <button
            onClick={onRestart}
            className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium 
                       rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 
                       focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Start over
          </button>
        )}
      </div>
    </div>
  );
}

