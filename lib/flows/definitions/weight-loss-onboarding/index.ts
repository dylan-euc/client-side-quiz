import { FlowDefinition } from '../../engine/types';
import { weightLossOnboarding_v1_0_0 } from './v1.0.0';
import { weightLossOnboarding_v1_0_1 } from './v1.0.1';
import { weightLossOnboarding_v1_1_0 } from './v1.1.0';
import { weightLossOnboarding_v1_2_0 } from './v1.2.0';

/**
 * All versions of the Weight Loss Onboarding flow.
 * Ordered from newest to oldest.
 * 
 * To get a specific version, use `getFlowByVersion(flowId, version)` from the registry.
 */
export const weightLossOnboardingVersions: FlowDefinition[] = [
  weightLossOnboarding_v1_2_0,
  weightLossOnboarding_v1_1_0,
  weightLossOnboarding_v1_0_1,
  weightLossOnboarding_v1_0_0,
];

/**
 * The current (active) version of the flow.
 * This is what users will see when they start a new quiz.
 */
export const weightLossOnboarding = weightLossOnboarding_v1_2_0;

// Re-export individual versions for direct access
export { weightLossOnboarding_v1_0_0 } from './v1.0.0';
export { weightLossOnboarding_v1_0_1 } from './v1.0.1';
export { weightLossOnboarding_v1_1_0 } from './v1.1.0';
export { weightLossOnboarding_v1_2_0 } from './v1.2.0';

