'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { questionTypeMeta } from '@/lib/flows/question-types/metadata';
import { QuestionRenderer } from '@/lib/flows/components/question-renderer';
import { Step } from '@/lib/flows/engine/types';

// ============================================================================
// Types
// ============================================================================

interface BuilderStep {
  id: string;
  type: string;
  question: string;
  description?: string;
  shortcode: string;
  options?: { value: string; label: string }[];
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  next: string;
}

interface BuilderOutcome {
  id: string;
  type: 'eligible' | 'ineligible';
  message: string;
}

interface BuilderFlow {
  id: string;
  name: string;
  version: string;
  steps: BuilderStep[];
  outcomes: BuilderOutcome[];
}

// ============================================================================
// Helpers
// ============================================================================

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 6)}`;
}

function createDefaultStep(type: string): BuilderStep {
  const base: BuilderStep = {
    id: generateId('step'),
    type,
    question: 'New question',
    shortcode: generateId('sc'),
    next: '',
  };

  if (type === 'radio' || type === 'checkbox' || type === 'dropdown') {
    base.options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];
  }

  if (type === 'number') {
    base.validation = { required: true };
  }

  return base;
}

function generateTypeScriptConfig(flow: BuilderFlow): string {
  const stepsCode = flow.steps.map((step, index) => {
    const nextStep = flow.steps[index + 1];
    const nextValue = step.next || (nextStep ? `'${nextStep.id}'` : `'outcome:${flow.outcomes[0]?.id || 'end'}'`);
    
    let stepCode = `    {
      id: '${step.id}',
      type: '${step.type}',
      shortcode: '${step.shortcode}',
      question: '${step.question.replace(/'/g, "\\'")}',`;
    
    if (step.description) {
      stepCode += `\n      description: '${step.description.replace(/'/g, "\\'")}',`;
    }
    
    if (step.options && step.options.length > 0) {
      stepCode += `\n      options: [
${step.options.map(o => `        { value: '${o.value}', label: '${o.label}' },`).join('\n')}
      ],`;
    }
    
    if (step.validation) {
      const validationParts: string[] = [];
      if (step.validation.required) validationParts.push('required: true');
      if (step.validation.min !== undefined) validationParts.push(`min: ${step.validation.min}`);
      if (step.validation.max !== undefined) validationParts.push(`max: ${step.validation.max}`);
      if (validationParts.length > 0) {
        stepCode += `\n      validation: { ${validationParts.join(', ')} },`;
      }
    }
    
    stepCode += `\n      next: ${nextValue},
    }`;
    
    return stepCode;
  }).join(',\n');

  const outcomesCode = flow.outcomes.map(outcome => 
    `    'outcome:${outcome.id}': {
      type: '${outcome.type}',
      message: '${outcome.message.replace(/'/g, "\\'")}',
    }`
  ).join(',\n');

  return `import { defineFlow } from '../engine/types';

export const ${flow.id.replace(/-/g, '_')} = defineFlow({
  id: '${flow.id}',
  name: '${flow.name}',
  version: '${flow.version}',
  initialStep: '${flow.steps[0]?.id || ''}',

  steps: [
${stepsCode}
  ],

  outcomes: {
${outcomesCode}
  },
});
`;
}

// ============================================================================
// Components
// ============================================================================

function StepEditor({ 
  step, 
  onChange, 
  onDelete,
  allSteps,
  outcomes,
}: { 
  step: BuilderStep;
  onChange: (step: BuilderStep) => void;
  onDelete: () => void;
  allSteps: BuilderStep[];
  outcomes: BuilderOutcome[];
}) {
  const typeMeta = questionTypeMeta.find(t => t.type === step.type);
  const hasOptions = ['radio', 'checkbox', 'dropdown'].includes(step.type);
  const hasValidation = ['number', 'text', 'email'].includes(step.type);

  const nextOptions = [
    ...allSteps.filter(s => s.id !== step.id).map(s => ({ value: s.id, label: s.question.slice(0, 30) })),
    ...outcomes.map(o => ({ value: `outcome:${o.id}`, label: `→ ${o.type}: ${o.id}` })),
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded font-medium ${typeMeta?.color || 'bg-gray-100'}`}>
            {step.type}
          </span>
          <span className="text-xs text-gray-400 font-mono">{step.id}</span>
        </div>
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
        <input
          type="text"
          value={step.question}
          onChange={(e) => onChange({ ...step, question: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
        <input
          type="text"
          value={step.description || ''}
          onChange={(e) => onChange({ ...step, description: e.target.value || undefined })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Additional context for the user"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shortcode</label>
        <input
          type="text"
          value={step.shortcode}
          onChange={(e) => onChange({ ...step, shortcode: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {hasOptions && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
          <div className="space-y-2">
            {step.options?.map((option, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => {
                    const newOptions = [...(step.options || [])];
                    newOptions[idx] = { ...option, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') };
                    onChange({ ...step, options: newOptions });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Option label"
                />
                <button
                  onClick={() => {
                    const newOptions = step.options?.filter((_, i) => i !== idx);
                    onChange({ ...step, options: newOptions });
                  }}
                  className="px-2 text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const newOptions = [...(step.options || []), { value: `option${(step.options?.length || 0) + 1}`, label: 'New option' }];
                onChange({ ...step, options: newOptions });
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add option
            </button>
          </div>
        </div>
      )}

      {hasValidation && (
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={step.validation?.required || false}
              onChange={(e) => onChange({ ...step, validation: { ...step.validation, required: e.target.checked } })}
              className="rounded border-gray-300"
            />
            Required
          </label>
          {step.type === 'number' && (
            <>
              <div className="flex items-center gap-1">
                <label className="text-sm text-gray-600">Min:</label>
                <input
                  type="number"
                  value={step.validation?.min ?? ''}
                  onChange={(e) => onChange({ ...step, validation: { ...step.validation, min: e.target.value ? Number(e.target.value) : undefined } })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-center gap-1">
                <label className="text-sm text-gray-600">Max:</label>
                <input
                  type="number"
                  value={step.validation?.max ?? ''}
                  onChange={(e) => onChange({ ...step, validation: { ...step.validation, max: e.target.value ? Number(e.target.value) : undefined } })}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            </>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Next step</label>
        <select
          value={step.next}
          onChange={(e) => onChange({ ...step, next: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">→ Next in sequence</option>
          {nextOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PreviewPanel({ step, value, onChange }: { step: BuilderStep | null; value: unknown; onChange: (v: unknown) => void }) {
  if (!step) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Select a step to preview</p>
      </div>
    );
  }

  const fullStep: Step = {
    id: step.id,
    type: step.type as Step['type'],
    shortcode: step.shortcode,
    question: step.question,
    description: step.description,
    options: step.options,
    validation: step.validation,
    next: step.next || 'next',
  };

  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-auto">
      <QuestionRenderer
        step={fullStep}
        value={value}
        onChange={onChange}
        onSubmit={() => {}}
      />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function BuilderClient() {
  const [flow, setFlow] = useState<BuilderFlow>({
    id: 'new-flow',
    name: 'New Flow',
    version: '1.0.0',
    steps: [],
    outcomes: [
      { id: 'eligible', type: 'eligible', message: 'You qualify!' },
    ],
  });
  
  const [selectedStepId, setSelectedStepId] = useState<string | null>(null);
  const [previewValue, setPreviewValue] = useState<unknown>(undefined);
  const [showExport, setShowExport] = useState(false);

  const selectedStep = flow.steps.find(s => s.id === selectedStepId) || null;

  const addStep = useCallback((type: string) => {
    const newStep = createDefaultStep(type);
    setFlow(f => ({ ...f, steps: [...f.steps, newStep] }));
    setSelectedStepId(newStep.id);
    setPreviewValue(undefined);
  }, []);

  const updateStep = useCallback((updated: BuilderStep) => {
    setFlow(f => ({
      ...f,
      steps: f.steps.map(s => s.id === updated.id ? updated : s),
    }));
  }, []);

  const deleteStep = useCallback((id: string) => {
    setFlow(f => ({
      ...f,
      steps: f.steps.filter(s => s.id !== id),
    }));
    if (selectedStepId === id) {
      setSelectedStepId(null);
    }
  }, [selectedStepId]);

  const moveStep = useCallback((id: string, direction: 'up' | 'down') => {
    setFlow(f => {
      const idx = f.steps.findIndex(s => s.id === id);
      if (idx === -1) return f;
      if (direction === 'up' && idx === 0) return f;
      if (direction === 'down' && idx === f.steps.length - 1) return f;
      
      const newSteps = [...f.steps];
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
      [newSteps[idx], newSteps[swapIdx]] = [newSteps[swapIdx], newSteps[idx]];
      return { ...f, steps: newSteps };
    });
  }, []);

  const exportConfig = generateTypeScriptConfig(flow);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              ← Back
            </Link>
            <div>
              <input
                type="text"
                value={flow.name}
                onChange={(e) => setFlow(f => ({ ...f, name: e.target.value }))}
                className="text-xl font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
              />
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="text"
                  value={flow.id}
                  onChange={(e) => setFlow(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  className="text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0 font-mono"
                  placeholder="flow-id"
                />
                <span className="text-gray-300">•</span>
                <input
                  type="text"
                  value={flow.version}
                  onChange={(e) => setFlow(f => ({ ...f, version: e.target.value }))}
                  className="text-sm text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-16"
                  placeholder="1.0.0"
                />
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowExport(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Export Config
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Step List */}
          <div className="col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Steps ({flow.steps.length})</h2>
            </div>

            {/* Add Step Buttons */}
            <div className="flex flex-wrap gap-2">
              {questionTypeMeta.filter(t => t.type !== 'stop').map(type => (
                <button
                  key={type.type}
                  onClick={() => addStep(type.type)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all hover:shadow-md ${type.color}`}
                >
                  + {type.name}
                </button>
              ))}
            </div>

            {/* Step List */}
            <div className="space-y-2">
              {flow.steps.map((step, idx) => {
                const typeMeta = questionTypeMeta.find(t => t.type === step.type);
                return (
                  <div
                    key={step.id}
                    onClick={() => { setSelectedStepId(step.id); setPreviewValue(undefined); }}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedStepId === step.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono w-5">{idx + 1}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${typeMeta?.color || 'bg-gray-100'}`}>
                        {step.type}
                      </span>
                      <span className="text-sm text-gray-700 truncate flex-1">{step.question}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveStep(step.id, 'up'); }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          disabled={idx === 0}
                        >
                          ↑
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveStep(step.id, 'down'); }}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          disabled={idx === flow.steps.length - 1}
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {flow.steps.length === 0 && (
                <div className="p-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                  <p>No steps yet</p>
                  <p className="text-sm mt-1">Click a question type above to add one</p>
                </div>
              )}
            </div>

            {/* Outcomes */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-700 mb-2">Outcomes</h3>
              <div className="space-y-2">
                {flow.outcomes.map(outcome => (
                  <div key={outcome.id} className="p-2 rounded-lg bg-green-50 border border-green-200 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${outcome.type === 'eligible' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {outcome.type}
                      </span>
                      <span className="font-mono text-xs text-gray-500">{outcome.id}</span>
                    </div>
                    <input
                      type="text"
                      value={outcome.message}
                      onChange={(e) => {
                        setFlow(f => ({
                          ...f,
                          outcomes: f.outcomes.map(o => o.id === outcome.id ? { ...o, message: e.target.value } : o),
                        }));
                      }}
                      className="mt-1 w-full px-2 py-1 text-xs border border-green-200 rounded bg-white"
                    />
                  </div>
                ))}
                <button
                  onClick={() => {
                    const id = generateId('outcome');
                    setFlow(f => ({
                      ...f,
                      outcomes: [...f.outcomes, { id, type: 'ineligible', message: 'Sorry, you do not qualify.' }],
                    }));
                  }}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Add outcome
                </button>
              </div>
            </div>
          </div>

          {/* Middle Panel - Step Editor */}
          <div className="col-span-4">
            <h2 className="font-semibold text-gray-900 mb-4">Edit Step</h2>
            {selectedStep ? (
              <StepEditor
                step={selectedStep}
                onChange={updateStep}
                onDelete={() => deleteStep(selectedStep.id)}
                allSteps={flow.steps}
                outcomes={flow.outcomes}
              />
            ) : (
              <div className="p-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <p>Select a step to edit</p>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="col-span-4">
            <h2 className="font-semibold text-gray-900 mb-4">Preview</h2>
            <div className="bg-gray-100 rounded-xl p-4 min-h-[400px]">
              <PreviewPanel
                step={selectedStep}
                value={previewValue}
                onChange={setPreviewValue}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Export Configuration</h2>
              <button
                onClick={() => setShowExport(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <p className="text-sm text-gray-600 mb-4">
                Copy this TypeScript configuration and save it to{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">lib/flows/definitions/{flow.id}.ts</code>
              </p>
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto font-mono">
                {exportConfig}
              </pre>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowExport(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(exportConfig);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

