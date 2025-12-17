import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';
import { FlowDefinition, Step, Outcome } from './types';
import { hasBranching, branchToLabel } from './conditions';

// ============================================================================
// Types
// ============================================================================

export interface StepNodeData {
  type: 'step';
  step: Step;
  isInitial: boolean;
  hasBranching: boolean;
  [key: string]: unknown; // Index signature for ReactFlow compatibility
}

export interface OutcomeNodeData {
  type: 'outcome';
  outcomeId: string;
  outcome: Outcome;
  [key: string]: unknown; // Index signature for ReactFlow compatibility
}

export type FlowNodeData = StepNodeData | OutcomeNodeData;

export interface FlowEdgeData {
  label?: string;
  isDefault: boolean;
  [key: string]: unknown; // Index signature for ReactFlow compatibility
}

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge<FlowEdgeData>;

// ============================================================================
// Graph Generation
// ============================================================================

/**
 * Generate ReactFlow nodes and edges from a flow definition
 */
export function generateFlowGraph(flow: FlowDefinition): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  const nodes: FlowNode[] = [];
  const edges: FlowEdge[] = [];

  // Create step nodes
  flow.steps.forEach((step) => {
    nodes.push({
      id: step.id,
      type: 'stepNode',
      position: { x: 0, y: 0 }, // Will be set by layout
      data: {
        type: 'step',
        step,
        isInitial: step.id === flow.initialStep,
        hasBranching: hasBranching(step.next),
      },
    });

    // Create edges from this step (skip if next is empty - e.g., stop types)
    if (typeof step.next === 'string') {
      // Simple single edge - only create if target is not empty
      if (step.next) {
        edges.push({
          id: `${step.id}->${step.next}`,
          source: step.id,
          target: step.next,
          type: 'conditionEdge',
          data: {
            isDefault: true,
          },
        });
      }
    } else {
      // Multiple branches
      step.next.forEach((branch, index) => {
        const target = 'default' in branch ? branch.default : branch.then;
        // Only create edge if target is not empty
        if (!target) return;
        
        const label = branchToLabel(branch);
        const isDefault = 'default' in branch;

        edges.push({
          id: `${step.id}->${target}[${index}]`,
          source: step.id,
          target,
          type: 'conditionEdge',
          label,
          data: {
            label,
            isDefault,
          },
        });
      });
    }
  });

  // Create outcome nodes
  Object.entries(flow.outcomes).forEach(([outcomeId, outcome]) => {
    nodes.push({
      id: outcomeId,
      type: 'outcomeNode',
      position: { x: 0, y: 0 }, // Will be set by layout
      data: {
        type: 'outcome',
        outcomeId,
        outcome,
      },
    });
  });

  return { nodes, edges };
}

// ============================================================================
// Auto Layout with Dagre
// ============================================================================

const NODE_WIDTH = 200;
const NODE_HEIGHT = 80;

/**
 * Apply dagre layout to position nodes
 */
export function layoutGraph(
  nodes: FlowNode[],
  edges: FlowEdge[],
  direction: 'TB' | 'LR' = 'TB'
): FlowNode[] {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 50,
    ranksep: 80,
    marginx: 20,
    marginy: 20,
  });

  // Add nodes to dagre
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  // Add edges to dagre
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Run layout
  dagre.layout(dagreGraph);

  // Apply positions to nodes
  return nodes.map((node) => {
    const dagreNode = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
      },
    };
  });
}

/**
 * Generate and layout a flow graph in one call
 */
export function createFlowGraph(
  flow: FlowDefinition,
  direction: 'TB' | 'LR' = 'TB'
): {
  nodes: FlowNode[];
  edges: FlowEdge[];
} {
  const { nodes, edges } = generateFlowGraph(flow);
  const layoutedNodes = layoutGraph(nodes, edges, direction);
  return { nodes: layoutedNodes, edges };
}
