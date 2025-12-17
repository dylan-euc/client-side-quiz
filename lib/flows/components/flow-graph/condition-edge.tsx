'use client';

import { memo } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import type { FlowEdgeData } from '../../engine/graph';

function ConditionEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeData = data as FlowEdgeData | undefined;
  const isDefault = edgeData?.isDefault ?? true;
  const label = edgeData?.label;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#3b82f6' : isDefault ? '#9ca3af' : '#f59e0b',
          strokeWidth: selected ? 2.5 : 2,
          strokeDasharray: isDefault ? 'none' : '5,5',
        }}
        markerEnd={`url(#${isDefault ? 'arrow-default' : 'arrow-condition'})`}
      />
      {label && !isDefault && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className={`
              px-2 py-0.5 rounded text-xs font-medium
              ${selected 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-amber-100 text-amber-800 border border-amber-200'
              }
            `}
            title={label}
          >
            <span className="line-clamp-1 max-w-[120px]">{label}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const ConditionEdge = memo(ConditionEdgeComponent);
