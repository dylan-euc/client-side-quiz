'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { getFlow, getFlowByVersion } from '@/lib/flows/registry';
import { QuestionRenderer } from '@/lib/flows/components/question-renderer';
import { OutcomeScreen } from '@/lib/flows/components/outcome-screen';
import { FlowGraph } from '@/lib/flows/components/flow-graph';
import { Step, Outcome } from '@/lib/flows/engine/types';
import { hasBranching, branchToLabel } from '@/lib/flows/engine/conditions';
import { getTypeColors } from '@/lib/flows/question-types/colors';

const SCALE = 0.666; // 2/3 scale
const VIEWPORT_WIDTH = 400; // Simulated mobile viewport width
const VIEWPORT_HEIGHT = 600; // Simulated mobile viewport height

type TabType = 'questions' | 'logic';

export function VisualizerClient({ flowId }: { flowId: string }) {
  const searchParams = useSearchParams();
  const version = searchParams.get('version');
  
  // Get specific version if provided, otherwise current
  const flow = version ? getFlowByVersion(flowId, version) : getFlow(flowId);
  const currentFlow = getFlow(flowId);
  const isViewingOldVersion = version && currentFlow && version !== currentFlow.version;
  
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('questions');

  // Analyze the flow
  const analysis = useMemo(() => {
    if (!flow) return null;

    const typeCount: Record<string, number> = {};
    const branchingSteps: string[] = [];

    flow.steps.forEach((step) => {
      typeCount[step.type] = (typeCount[step.type] || 0) + 1;
      if (hasBranching(step.next)) {
        branchingSteps.push(step.id);
      }
    });

    return {
      typeCount,
      branchingSteps,
      totalSteps: flow.steps.length,
      totalOutcomes: Object.keys(flow.outcomes).length,
    };
  }, [flow]);

  if (!flow) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Flow not found</h1>
          <p className="text-gray-600 mb-4">
            The flow &quot;{flowId}&quot; does not exist.
          </p>
          <Link href={`/flows/${flowId}`} className="text-blue-600 hover:underline">
            ← Back to flow
          </Link>
        </div>
      </div>
    );
  }

  const selectedStep = selectedId ? flow.steps.find((s) => s.id === selectedId) ?? null : null;
  const selectedOutcome = selectedId?.startsWith('outcome:') ? flow.outcomes[selectedId] ?? null : null;

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Old Version Banner */}
      {isViewingOldVersion && (
        <div className="bg-amber-500 text-amber-950 px-6 py-2 text-center text-sm font-medium">
          Viewing historical version v{flow.version} — 
          <Link href={`/flows/${flowId}/visualizer`} className="underline ml-1">
            View current (v{currentFlow?.version})
          </Link>
        </div>
      )}

      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href={`/flows/${flowId}`}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
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
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">{flow.name}</h1>
                {isViewingOldVersion && (
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">
                    Historical
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">
                v{flow.version} • {analysis?.totalSteps} steps • {analysis?.totalOutcomes} outcomes
              </p>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2">
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'questions'
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Questions
              </button>
              <button
                onClick={() => setActiveTab('logic')}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'logic'
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Logic & Outcomes
              </button>
            </div>
            
            <Link
              href={`/flows/${flowId}/preview`}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors ml-4"
            >
              Try Quiz →
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {activeTab === 'questions' ? (
        <QuestionsTab
          flow={flow}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedStep={selectedStep}
          selectedOutcome={selectedOutcome}
        />
      ) : (
        <LogicTab
          flow={flow}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedStep={selectedStep}
          selectedOutcome={selectedOutcome}
        />
      )}
    </div>
  );
}

// ============================================================================
// Questions Tab
// ============================================================================

function QuestionsTab({
  flow,
  selectedId,
  setSelectedId,
  selectedStep,
  selectedOutcome,
}: {
  flow: NonNullable<ReturnType<typeof getFlow>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedStep: Step | null;
  selectedOutcome: Outcome | null;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 space-y-8">
          {/* Questions Section */}
          <div>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Questions ({flow.steps.length})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Click to select
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {flow.steps.map((step, index) => (
                <ScaledQuestionPreview
                  key={step.id}
                  step={step}
                  index={index}
                  isSelected={selectedId === step.id}
                  isInitial={step.id === flow.initialStep}
                  hasBranchingLogic={hasBranching(step.next)}
                  onClick={() => setSelectedId(selectedId === step.id ? null : step.id)}
                />
              ))}
            </div>
          </div>

          {/* Outcomes Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                Outcomes ({Object.keys(flow.outcomes).length})
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {Object.entries(flow.outcomes).map(([id, outcome]) => (
                <ScaledOutcomePreview
                  key={id}
                  outcome={outcome}
                  isSelected={selectedId === id}
                  onClick={() => setSelectedId(selectedId === id ? null : id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selection Panel - Overlay */}
      <SelectionPanel
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        selectedStep={selectedStep}
        selectedOutcome={selectedOutcome}
      />
    </>
  );
}

// ============================================================================
// Logic & Outcomes Tab
// ============================================================================

function LogicTab({
  flow,
  selectedId,
  setSelectedId,
  selectedStep,
  selectedOutcome,
}: {
  flow: NonNullable<ReturnType<typeof getFlow>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedStep: Step | null;
  selectedOutcome: Outcome | null;
}) {
  return (
    <>
      {/* Flow Graph */}
      <div className="flex-1 relative min-h-0">
        <FlowGraph
          flow={flow}
          direction="TB"
          onNodeSelect={setSelectedId}
        />
        
        {/* Legend */}
        <div className="absolute top-4 right-4 bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Legend</h3>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
              <span className="text-gray-300">Start step</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
              <span className="text-gray-300">Has branching</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-gray-300">Eligible outcome</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="text-gray-300">Ineligible outcome</span>
            </div>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-700">
              <div className="w-6 h-0 border-t-2 border-gray-400"></div>
              <span className="text-gray-300">Default path</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-0 border-t-2 border-amber-500 border-dashed"></div>
              <span className="text-gray-300">Conditional path</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Panel - Overlay */}
      <SelectionPanel
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        selectedStep={selectedStep}
        selectedOutcome={selectedOutcome}
      />
    </>
  );
}

// ============================================================================
// Selection Panel (shared between tabs)
// ============================================================================

function SelectionPanel({
  selectedId,
  setSelectedId,
  selectedStep,
  selectedOutcome,
}: {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedStep: Step | null;
  selectedOutcome: Outcome | null;
}) {
  if (!selectedId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setSelectedId(null)}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-80 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto z-50 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold">
              {selectedStep ? 'Step Details' : 'Outcome Details'}
            </h3>
            <code className="text-xs text-gray-400 font-mono break-all">{selectedId}</code>
          </div>
          <button
            onClick={() => setSelectedId(null)}
            className="text-gray-400 hover:text-white flex-shrink-0 ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      {selectedStep && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Type</div>
              <div className="text-white font-medium">{selectedStep.type}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Required</div>
              <div className="text-white font-medium">
                {selectedStep.validation?.required ? 'Yes' : 'No'}
              </div>
            </div>
          </div>
          
          {selectedStep.shortcode && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Shortcode</div>
              <div className="text-white font-mono text-xs break-all">{selectedStep.shortcode}</div>
            </div>
          )}
          
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Next</div>
            <div className="text-white font-mono text-xs break-all">
              {hasBranching(selectedStep.next) 
                ? `(${selectedStep.next.length} branches)` 
                : selectedStep.next}
            </div>
          </div>

          {/* Branching Details */}
          {hasBranching(selectedStep.next) && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-2">Branching Logic</div>
              <div className="space-y-2">
                {selectedStep.next.map((branch, index) => {
                  const target = 'default' in branch ? branch.default : branch.then;
                  const label = branchToLabel(branch);
                  const isDefault = 'default' in branch;
                  
                  return (
                    <div
                      key={index}
                      className={`text-sm ${
                        isDefault ? 'text-gray-400' : 'text-amber-400'
                      }`}
                    >
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-mono mb-1 ${
                        isDefault ? 'bg-gray-600' : 'bg-amber-500/20'
                      }`}>
                        {label}
                      </span>
                      <div className="flex items-center gap-2 pl-2">
                        <span className="text-gray-500">→</span>
                        <span className="text-white font-mono text-xs break-all">{target}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedStep.options && selectedStep.options.length > 0 && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-2">Options ({selectedStep.options.length})</div>
              <div className="flex flex-wrap gap-2">
                {selectedStep.options.map((opt) => (
                  <span key={opt.value} className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded">
                    {opt.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {selectedOutcome && (
        <div className="space-y-3 text-sm">
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Type</div>
            <div className="text-white font-medium">{selectedOutcome.type}</div>
          </div>
          {selectedOutcome.reason && (
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Reason</div>
              <div className="text-white">{selectedOutcome.reason}</div>
            </div>
          )}
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Message</div>
            <div className="text-gray-300 text-sm">{selectedOutcome.message || 'No message'}</div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

// ============================================================================
// Scaled Question Preview Component
// ============================================================================

function ScaledQuestionPreview({
  step,
  index,
  isSelected,
  isInitial,
  hasBranchingLogic,
  onClick,
}: {
  step: Step;
  index: number;
  isSelected: boolean;
  isInitial: boolean;
  hasBranchingLogic: boolean;
  onClick: () => void;
}) {
  const scaledWidth = VIEWPORT_WIDTH * SCALE;
  const scaledHeight = VIEWPORT_HEIGHT * SCALE;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`
        relative flex-shrink-0 rounded-lg overflow-hidden transition-all cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
          : 'hover:ring-2 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-gray-900'
        }
      `}
      style={{ width: scaledWidth, height: scaledHeight }}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        <span className="text-[10px] bg-black/70 text-white px-1.5 py-0.5 rounded font-medium">
          #{index + 1}
        </span>
        {isInitial && (
          <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-medium">
            Start
          </span>
        )}
        {hasBranchingLogic && (
          <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-medium" title="Has branching logic">
            ⚡
          </span>
        )}
      </div>

      {/* Type Badge */}
      <div className="absolute bottom-2 left-2 z-10">
        <TypeBadge type={step.type} size="small" />
      </div>

      {/* Scaled Content Container - pointer-events-none to prevent nested buttons from capturing clicks */}
      <div
        className="origin-top-left bg-white pointer-events-none"
        style={{
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          transform: `scale(${SCALE})`,
        }}
      >
        {/* Simulated Quiz Page */}
        <div className="p-8 h-full flex flex-col">
          <div className="flex-1">
            <QuestionRenderer
              step={step}
              value={undefined}
              onChange={() => {}}
              onSubmit={() => {}}
              error={null}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Scaled Outcome Preview Component
// ============================================================================

function ScaledOutcomePreview({
  outcome,
  isSelected,
  onClick,
}: {
  outcome: Outcome;
  isSelected: boolean;
  onClick: () => void;
}) {
  const scaledWidth = VIEWPORT_WIDTH * SCALE;
  const scaledHeight = VIEWPORT_HEIGHT * SCALE;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      className={`
        relative flex-shrink-0 rounded-lg overflow-hidden transition-all cursor-pointer
        ${isSelected 
          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' 
          : 'hover:ring-2 hover:ring-gray-500 hover:ring-offset-2 hover:ring-offset-gray-900'
        }
      `}
      style={{ width: scaledWidth, height: scaledHeight }}
    >
      {/* Outcome Type Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span
          className={`
            text-[10px] px-1.5 py-0.5 rounded text-white font-medium
            ${outcome.type === 'eligible' ? 'bg-green-500' : ''}
            ${outcome.type === 'ineligible' ? 'bg-red-500' : ''}
            ${outcome.type === 'needs-review' ? 'bg-amber-500' : ''}
            ${!['eligible', 'ineligible', 'needs-review'].includes(outcome.type) ? 'bg-gray-500' : ''}
          `}
        >
          {outcome.type}
        </span>
      </div>

      {/* Scaled Content Container - pointer-events-none to prevent nested buttons from capturing clicks */}
      <div
        className="origin-top-left bg-white pointer-events-none"
        style={{
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT,
          transform: `scale(${SCALE})`,
        }}
      >
        {/* Simulated Outcome Page */}
        <div className="p-8 h-full flex items-center justify-center">
          <OutcomeScreen outcome={outcome} onRestart={() => {}} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Type Badge Component
// ============================================================================

function TypeBadge({ type, size = 'normal' }: { type: string; size?: 'normal' | 'small' | 'tiny' }) {
  const colors = getTypeColors(type);

  if (size === 'tiny') {
    return (
      <span className={`text-[8px] text-white px-1 rounded ${colors.badge}`}>
        {type}
      </span>
    );
  }

  if (size === 'small') {
    return (
      <span className={`text-[10px] text-white px-1.5 py-0.5 rounded font-medium ${colors.badge}`}>
        {type}
      </span>
    );
  }

  return (
    <span className={`text-xs text-white px-2 py-0.5 rounded font-medium ${colors.badge}`}>
      {type}
    </span>
  );
}

