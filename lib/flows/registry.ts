import { FlowDefinition } from './engine/types';
import { 
  weightLossOnboarding, 
  weightLossOnboardingVersions 
} from './definitions/weight-loss-onboarding';
import { skinConsult } from './definitions/skin-consult';

/**
 * Registry of all available flows (current versions).
 * Add new flows here to make them available in the app.
 */
export const flowRegistry: Record<string, FlowDefinition> = {
  'weight-loss-onboarding': weightLossOnboarding,
  'skin-consult': skinConsult,
};

/**
 * Registry of all flow versions.
 * Key is flow ID, value is array of all versions (newest first).
 */
export const flowVersionsRegistry: Record<string, FlowDefinition[]> = {
  'weight-loss-onboarding': weightLossOnboardingVersions,
  'skin-consult': [skinConsult], // Only one version for now
};

/**
 * Get a flow by its ID (returns current version)
 */
export function getFlow(flowId: string): FlowDefinition | undefined {
  return flowRegistry[flowId];
}

/**
 * Get all versions of a flow by its ID
 */
export function getFlowVersions(flowId: string): FlowDefinition[] {
  return flowVersionsRegistry[flowId] || [];
}

/**
 * Get a specific version of a flow
 */
export function getFlowByVersion(flowId: string, version: string): FlowDefinition | undefined {
  const versions = flowVersionsRegistry[flowId];
  if (!versions) return undefined;
  return versions.find((flow) => flow.version === version);
}

/**
 * Get all registered flows (current versions)
 */
export function getAllFlows(): FlowDefinition[] {
  return Object.values(flowRegistry);
}

/**
 * Check if a flow exists
 */
export function flowExists(flowId: string): boolean {
  return flowId in flowRegistry;
}
