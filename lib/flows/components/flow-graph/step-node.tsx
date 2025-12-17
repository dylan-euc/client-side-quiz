'use client';

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { StepNodeData } from '../../engine/graph';
import { getTypeColors } from '../../question-types/colors';

function StepNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as StepNodeData;
  const { step, isInitial, hasBranching } = nodeData;
  const colors = getTypeColors(step.type);
  const borderColor = `${colors.border} ${colors.bg}`;
  const badgeColor = colors.badge;

  return (
    <div
      className={`
        relative px-4 py-3 rounded-lg border-2 shadow-sm min-w-[180px] max-w-[220px]
        transition-all
        ${borderColor}
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      {/* Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white"
      />

      {/* Badges */}
      <div className="absolute -top-2 left-2 flex gap-1">
        {isInitial && (
          <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded font-medium">
            Start
          </span>
        )}
        {hasBranching && (
          <span
            className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded font-medium"
            title="Has branching logic"
          >
            ⚡
          </span>
        )}
      </div>

      {/* Type badge */}
      <div className="absolute -top-2 right-2">
        <span className={`text-[10px] text-white px-1.5 py-0.5 rounded font-medium ${badgeColor}`}>
          {step.type}
        </span>
      </div>

      {/* Content */}
      <div className="mt-1">
        <div className="text-xs font-mono text-gray-400 mb-1">{step.id}</div>
        <div className="text-sm font-medium text-gray-800 line-clamp-2" title={step.question}>
          {step.question}
        </div>
      </div>
    </div>
  );
}

export const StepNode = memo(StepNodeComponent);
