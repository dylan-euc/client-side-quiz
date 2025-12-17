'use client';

import { useState } from 'react';
import { Step } from '../engine/types';
import { getQuestionType } from '../question-types';

interface QuestionRendererProps {
  step: Step;
  value: unknown;
  onChange: (value: unknown) => void;
  onSubmit: () => void;
  error?: string | null;
  isSubmitting?: boolean;
  submitLabel?: string;
}

// ============================================================================
// Help Text Modal Component
// ============================================================================

interface HelpTextModalProps {
  title?: string;
  content: string;
  linkText?: string;
  onClose: () => void;
}

function HelpTextModal({ title, content, onClose }: HelpTextModalProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-xl shadow-2xl z-50 animate-in zoom-in-95 duration-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {content}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-6 w-full py-2.5 px-4 bg-gray-100 text-gray-700 font-medium rounded-lg 
                       hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 
                       focus:ring-offset-2 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================================================
// Help Text Button
// ============================================================================

interface HelpTextButtonProps {
  onClick: () => void;
  linkText?: string;
}

function HelpTextButton({ onClick, linkText }: HelpTextButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{linkText ?? 'Why are we asking this?'}</span>
    </button>
  );
}

// ============================================================================
// Question Renderer
// ============================================================================

export function QuestionRenderer({
  step,
  value,
  onChange,
  onSubmit,
  error,
  isSubmitting,
  submitLabel = 'Continue',
}: QuestionRendererProps) {
  const [showHelp, setShowHelp] = useState(false);
  const questionType = getQuestionType(step.type);

  // Stop type - terminal screen with no navigation
  if (step.type === 'stop') {
    const StopComponent = questionType?.component;
    if (StopComponent) {
      return (
        <div className="space-y-6">
          <StopComponent
            step={step}
            value={value}
            onChange={onChange}
            error={error}
          />
          {/* No submit button for stop screens */}
        </div>
      );
    }
  }

  // Info steps just show a continue button (special case)
  if (step.type === 'info') {
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-start gap-2">
            <h2 className="text-2xl font-semibold text-gray-900 flex-1">{step.question}</h2>
            {step.helpText && (
              <HelpTextButton 
                onClick={() => setShowHelp(true)} 
                linkText={step.helpText.linkText}
              />
            )}
          </div>
          {step.description && (
            <p className="mt-3 text-gray-600 leading-relaxed">{step.description}</p>
          )}
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg 
                     hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Loading...' : 'Get Started'}
        </button>

        {/* Help Text Modal */}
        {showHelp && step.helpText && (
          <HelpTextModal
            title={step.helpText.title}
            content={step.helpText.content}
            linkText={step.helpText.linkText}
            onClose={() => setShowHelp(false)}
          />
        )}
      </div>
    );
  }

  // Unknown question type
  if (!questionType) {
    return <div className="text-red-600">Unknown step type: {step.type}</div>;
  }

  const InputComponent = questionType.component;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-start gap-2">
          <h2 className="text-2xl font-semibold text-gray-900 flex-1">{step.question}</h2>
        </div>
        {step.description && (
          <p className="mt-2 text-gray-600">{step.description}</p>
        )}
        {/* Help text link below description */}
        {step.helpText && (
          <div className="mt-3">
            <HelpTextButton 
              onClick={() => setShowHelp(true)} 
              linkText={step.helpText.linkText}
            />
          </div>
        )}
      </div>

      <InputComponent
        step={step}
        value={value}
        onChange={onChange}
        error={error}
      />

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg 
                   hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>

      {/* Help Text Modal */}
      {showHelp && step.helpText && (
        <HelpTextModal
          title={step.helpText.title}
          content={step.helpText.content}
          linkText={step.helpText.linkText}
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  );
}
