'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QuestionRenderer } from '@/lib/flows/components/question-renderer';
import { ProgressBar } from '@/lib/flows/components/progress-bar';
import { getQuestionType, allQuestionTypes } from '@/lib/flows/question-types';
import { Step } from '@/lib/flows/engine/types';

export function QuestionTypeClient({ type }: { type: string }) {
  const questionType = getQuestionType(type);
  
  // Editable step definition
  const [step, setStep] = useState<Step | null>(null);
  const [stepJson, setStepJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const [value, setValue] = useState<unknown>(undefined);
  const [debugOpen, setDebugOpen] = useState(false);

  // Initialize step from question type example
  useEffect(() => {
    if (questionType) {
      setStep(questionType.example);
      setStepJson(JSON.stringify(questionType.example, null, 2));
    }
  }, [questionType]);

  // Track changes to JSON
  const handleJsonChange = (newJson: string) => {
    setStepJson(newJson);
    setHasUnsavedChanges(true);
    setJsonError(null);
  };

  // Apply JSON changes
  const applyChanges = () => {
    try {
      const parsed = JSON.parse(stepJson) as Step;
      // Basic validation
      if (!parsed.id || !parsed.type || !parsed.question) {
        throw new Error('Step must have id, type, and question');
      }
      setStep(parsed);
      setHasUnsavedChanges(false);
      setJsonError(null);
      setValue(undefined); // Reset value when step changes
    } catch (err) {
      setJsonError(err instanceof Error ? err.message : 'Invalid JSON');
    }
  };

  // Reset to default
  const resetToDefault = () => {
    if (questionType) {
      setStep(questionType.example);
      setStepJson(JSON.stringify(questionType.example, null, 2));
      setHasUnsavedChanges(false);
      setJsonError(null);
      setValue(undefined);
    }
  };

  if (!questionType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Unknown question type</h1>
          <p className="text-gray-600 mb-4">
            The question type &quot;{type}&quot; is not recognized.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Available types: {allQuestionTypes.map(t => t.type).join(', ')}
          </p>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-100">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">{questionType.name}</h1>
            <span className={`text-xs px-2 py-0.5 rounded font-medium border ${questionType.color}`}>
              Preview
            </span>
            {hasUnsavedChanges && (
              <span className="text-xs px-2 py-0.5 rounded font-medium bg-amber-100 text-amber-700 border border-amber-200">
                Unsaved
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar (Placeholder) */}
        <ProgressBar current={1} total={2} percentage={50} />

        {/* Question Renderer */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <QuestionRenderer
            step={step}
            value={value}
            onChange={setValue}
            onSubmit={() => setDebugOpen(true)}
            error={null}
          />
        </div>
      </div>

      {/* Debug Overlay Button (Floating) */}
      <button
        onClick={() => setDebugOpen(true)}
        className={`
          fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg transition-all 
          flex items-center justify-center z-30
          ${hasUnsavedChanges 
            ? 'bg-amber-500 hover:bg-amber-600 text-white' 
            : 'bg-gray-800 hover:bg-gray-700 text-white'
          }
        `}
        title="Open dev config"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      </button>

      {/* Debug Panel Overlay */}
      {debugOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDebugOpen(false)}
          />

          {/* Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-gray-800 shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-4 flex items-center justify-between">
              <h2 className="font-semibold text-white">Dev Config</h2>
              <button
                onClick={() => setDebugOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Current Value */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Current Value</h3>
                <pre className="text-xs bg-gray-900 text-gray-300 p-3 rounded-lg overflow-auto max-h-32">
                  {value !== undefined ? JSON.stringify(value, null, 2) : 'undefined'}
                </pre>
              </div>

              {/* Set Value */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Set Value</h3>
                {step.options ? (
                  <div className="space-y-2">
                    {step.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          if (step.type === 'checkbox') {
                            const arr = (value as string[]) || [];
                            if (arr.includes(opt.value)) {
                              setValue(arr.filter((v) => v !== opt.value));
                            } else {
                              setValue([...arr, opt.value]);
                            }
                          } else {
                            setValue(opt.value);
                          }
                        }}
                        className={`
                          w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                          ${
                            step.type === 'checkbox'
                              ? (value as string[])?.includes(opt.value)
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : value === opt.value
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }
                        `}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <input
                    type={step.type === 'number' ? 'number' : 'text'}
                    value={(value as string) || ''}
                    onChange={(e) => setValue(step.type === 'number' ? Number(e.target.value) : e.target.value)}
                    placeholder={`Enter ${step.type} value...`}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                )}
                <button
                  onClick={() => setValue(undefined)}
                  className="mt-2 text-sm text-red-400 hover:text-red-300"
                >
                  Clear value
                </button>
              </div>

              {/* Editable Step Definition */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-300">Step Definition</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={resetToDefault}
                      className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={applyChanges}
                      disabled={!hasUnsavedChanges}
                      className={`
                        text-xs px-2 py-1 rounded transition-colors
                        ${hasUnsavedChanges
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                {jsonError && (
                  <div className="mb-2 p-2 bg-red-900/50 border border-red-700 rounded-lg text-xs text-red-300">
                    {jsonError}
                  </div>
                )}
                
                <textarea
                  value={stepJson}
                  onChange={(e) => handleJsonChange(e.target.value)}
                  spellCheck={false}
                  className={`
                    w-full h-80 px-3 py-2 bg-gray-900 text-gray-300 text-xs font-mono rounded-lg 
                    border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
                    ${jsonError ? 'border-red-500' : hasUnsavedChanges ? 'border-amber-500' : 'border-gray-700'}
                  `}
                />
                
                <p className="mt-2 text-xs text-gray-500">
                  Edit the JSON above and click &quot;Apply&quot; to see changes.
                  Required fields: <code className="text-gray-400">id</code>, <code className="text-gray-400">type</code>, <code className="text-gray-400">question</code>, <code className="text-gray-400">next</code>
                </p>
              </div>

              {/* Type Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Question Type</h3>
                <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${questionType.color}`}>
                      {questionType.type}
                    </span>
                    <span className="text-white font-medium">{questionType.name}</span>
                  </div>
                  <p className="text-gray-400 text-xs">{questionType.description}</p>
                </div>
              </div>

              {/* File Location */}
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-2">Source File</h3>
                <code className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg block">
                  lib/flows/question-types/{questionType.type}.tsx
                </code>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

