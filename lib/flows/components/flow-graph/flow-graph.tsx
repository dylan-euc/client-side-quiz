'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
} from '@xyflow/react';
import type { OnSelectionChangeParams, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FlowDefinition } from '../../engine/types';
import { createFlowGraph, FlowNodeData, FlowNode, FlowEdge } from '../../engine/graph';
import { StepNode } from './step-node';
import { OutcomeNode } from './outcome-node';
import { ConditionEdge } from './condition-edge';

// Custom node types
const nodeTypes = {
  stepNode: StepNode,
  outcomeNode: OutcomeNode,
};

// Custom edge types
const edgeTypes = {
  conditionEdge: ConditionEdge,
};

interface FlowGraphProps {
  flow: FlowDefinition;
  direction?: 'TB' | 'LR';
  onNodeSelect?: (nodeId: string | null) => void;
}

export function FlowGraph({ flow, direction = 'TB', onNodeSelect }: FlowGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => createFlowGraph(flow, direction),
    [flow, direction]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const handleSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      const nodeId = selectedNodes.length > 0 ? selectedNodes[0].id : null;
      onNodeSelect?.(nodeId);
    },
    [onNodeSelect]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onSelectionChange={handleSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'conditionEdge',
        }}
      >
        {/* Custom arrow markers */}
        <svg>
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
            </marker>
            <marker
              id="arrow-condition"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>

        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e5e7eb" />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const data = node.data as FlowNodeData;
            if (data.type === 'outcome') {
              const outcome = data.outcome;
              if (outcome.type === 'eligible') return '#22c55e';
              if (outcome.type === 'ineligible') return '#ef4444';
              return '#f59e0b';
            }
            return '#6b7280';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          className="!bg-gray-100 !border-gray-300"
        />
      </ReactFlow>
    </div>
  );
}
