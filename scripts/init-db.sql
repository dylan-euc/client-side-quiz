-- Client-Side Quiz Database Schema
-- Run with: psql $DATABASE_URL -f scripts/init-db.sql

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Flow sessions table
CREATE TABLE IF NOT EXISTS flow_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id       VARCHAR(100) NOT NULL,
  flow_version  VARCHAR(20) NOT NULL,
  user_id       VARCHAR(100),
  current_step  VARCHAR(100),
  status        VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  outcome       VARCHAR(100),
  started_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at  TIMESTAMP WITH TIME ZONE,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flow answers table (append-only)
CREATE TABLE IF NOT EXISTS flow_answers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID REFERENCES flow_sessions(id) ON DELETE CASCADE,
  step_id     VARCHAR(100) NOT NULL,
  shortcode   VARCHAR(100) NOT NULL,
  value       JSONB NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_flow_sessions_user ON flow_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_flow_sessions_flow ON flow_sessions(flow_id);
CREATE INDEX IF NOT EXISTS idx_flow_sessions_status ON flow_sessions(status);
CREATE INDEX IF NOT EXISTS idx_flow_sessions_flow_user_status ON flow_sessions(flow_id, user_id, status);
CREATE INDEX IF NOT EXISTS idx_flow_answers_session ON flow_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_flow_answers_shortcode ON flow_answers(shortcode);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for flow_sessions
DROP TRIGGER IF EXISTS update_flow_sessions_updated_at ON flow_sessions;
CREATE TRIGGER update_flow_sessions_updated_at
    BEFORE UPDATE ON flow_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify tables were created
DO $$
BEGIN
    RAISE NOTICE 'Database initialization complete!';
    RAISE NOTICE 'Tables created: flow_sessions, flow_answers';
END $$;

