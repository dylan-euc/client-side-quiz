/**
 * Shared static params generators for Next.js pages.
 * Used with generateStaticParams for static export.
 */

import { getAllFlows } from './registry';
import { questionTypeMeta } from './question-types/metadata';

/**
 * Generate static params for flow-based pages.
 * Returns all flow IDs for routes like /flows/[flowId] and /quiz/[flowId]
 */
export function generateFlowParams() {
  const flows = getAllFlows();
  return flows.map((flow) => ({ flowId: flow.id }));
}

/**
 * Generate static params for question type pages.
 * Returns all question type IDs for routes like /question-types/[type]
 */
export function generateQuestionTypeParams() {
  return questionTypeMeta.map((qt) => ({ type: qt.type }));
}

