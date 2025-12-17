'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { OutcomeNodeData } from '../../engine/graph';

const outcomeColors: Record<string, { border: string; bg: string; badge: string }> = {
  eligible: {
    border: 'border-green-400',
    bg: 'bg-green-50',
    badge: 'bg-green-500',
  },
  ineligible: {
    border: 'border-red-400',
    bg: 'bg-red-50',
    badge: 'bg-red-500',
  },
  'needs-review': {
    border: 'border-amber-400',
    bg: 'bg-amber-50',
    badge: 'bg-amber-500',
  },
};

function OutcomeNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as OutcomeNodeData;
  const { outcomeId, outcome } = nodeData;
  const colors = outcomeColors[outcome.type] || {
    border: 'border-gray-400',
    bg: 'bg-gray-50',
    badge: 'bg-gray-500',
  };

  // Extract display name from outcome ID (e.g., 'outcome:ineligible-age' -> 'ineligible-age')
  const displayId = outcomeId.replace('outcome:', '');

  return (
    <div
      className={`
        relative px-4 py-3 rounded-full border-2 shadow-sm min-w-[160px] max-w-[200px]
        transition-all text-center
        ${colors.border} ${colors.bg}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      {/* Handle (target only - outcomes are terminal) */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />

      {/* Type badge */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
        <span className={`text-[10px] text-white px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
          {outcome.type}
        </span>
      </div>

      {/* Content */}
      <div className="mt-1">
        <div className="text-xs font-mono text-gray-500">{displayId}</div>
        {outcome.reason && (
          <div className="text-xs text-gray-600 mt-0.5">{outcome.reason}</div>
        )}
      </div>
    </div>
  );
}

export const OutcomeNode = memo(OutcomeNodeComponent);
