'use server';

import { query, queryOne } from '@/lib/db';
import { randomUUID } from 'crypto';

// ============================================================================
// Types
// ============================================================================

export interface FlowSession {
  id: string;
  flowId: string;
  flowVersion: string;
  userId: string | null;
  currentStep: string | null;
  status: 'in_progress' | 'completed' | 'abandoned';
  outcome: string | null;
  startedAt: Date;
  completedAt: Date | null;
}

export interface FlowAnswer {
  id: string;
  sessionId: string;
  stepId: string;
  shortcode: string;
  value: unknown;
  createdAt: Date;
}

// ============================================================================
// Session Actions
// ============================================================================

/**
 * Create a new flow session.
 */
export async function createSession(
  flowId: string,
  flowVersion: string,
  userId?: string
): Promise<FlowSession> {
  const id = randomUUID();

  const [session] = await query<FlowSession>(
    `INSERT INTO flow_sessions (id, flow_id, flow_version, user_id, status)
     VALUES ($1, $2, $3, $4, 'in_progress')
     RETURNING id, flow_id as "flowId", flow_version as "flowVersion",
               user_id as "userId", current_step as "currentStep",
               status, outcome, started_at as "startedAt", completed_at as "completedAt"`,
    [id, flowId, flowVersion, userId ?? null]
  );

  return session;
}

/**
 * Get a session by ID with all its answers.
 */
export async function getSession(sessionId: string): Promise<{
  session: FlowSession;
  answers: FlowAnswer[];
} | null> {
  const session = await queryOne<FlowSession>(
    `SELECT id, flow_id as "flowId", flow_version as "flowVersion",
            user_id as "userId", current_step as "currentStep",
            status, outcome, started_at as "startedAt", completed_at as "completedAt"
     FROM flow_sessions WHERE id = $1`,
    [sessionId]
  );

  if (!session) return null;

  const answers = await query<FlowAnswer>(
    `SELECT id, session_id as "sessionId", step_id as "stepId",
            shortcode, value, created_at as "createdAt"
     FROM flow_answers WHERE session_id = $1 ORDER BY created_at ASC`,
    [sessionId]
  );

  return { session, answers };
}

// ============================================================================
// Answer Actions
// ============================================================================

/**
 * Save an answer for a step.
 */
export async function saveAnswer(
  sessionId: string,
  stepId: string,
  shortcode: string,
  value: unknown
): Promise<{ answerId: string }> {
  const id = randomUUID();

  await query(
    `INSERT INTO flow_answers (id, session_id, step_id, shortcode, value)
     VALUES ($1, $2, $3, $4, $5)`,
    [id, sessionId, stepId, shortcode, JSON.stringify(value)]
  );

  // Update current step on session
  await query(
    `UPDATE flow_sessions SET current_step = $1, updated_at = NOW() WHERE id = $2`,
    [stepId, sessionId]
  );

  return { answerId: id };
}

// ============================================================================
// Completion Actions
// ============================================================================

/**
 * Mark a session as completed with an outcome.
 */
export async function completeSession(
  sessionId: string,
  outcome: string
): Promise<FlowSession> {
  const [session] = await query<FlowSession>(
    `UPDATE flow_sessions
     SET status = 'completed', outcome = $1, completed_at = NOW(), updated_at = NOW()
     WHERE id = $2
     RETURNING id, flow_id as "flowId", flow_version as "flowVersion",
               user_id as "userId", current_step as "currentStep",
               status, outcome, started_at as "startedAt", completed_at as "completedAt"`,
    [outcome, sessionId]
  );

  return session;
}

/**
 * Find an incomplete session for a user.
 */
export async function findIncompleteSession(
  flowId: string,
  userId?: string
): Promise<FlowSession | null> {
  if (!userId) return null;

  return queryOne<FlowSession>(
    `SELECT id, flow_id as "flowId", flow_version as "flowVersion",
            user_id as "userId", current_step as "currentStep",
            status, outcome, started_at as "startedAt", completed_at as "completedAt"
     FROM flow_sessions
     WHERE flow_id = $1 AND user_id = $2 AND status = 'in_progress'
     ORDER BY started_at DESC LIMIT 1`,
    [flowId, userId]
  );
}

