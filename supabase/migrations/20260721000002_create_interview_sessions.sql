-- Create interview_sessions table
CREATE TABLE interview_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  role text NOT NULL,
  company text,
  difficulty text NOT NULL DEFAULT 'Medium',
  job_description text,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  feedback jsonb,
  overall_score integer,
  status text NOT NULL DEFAULT 'Not Started',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own interview sessions"
  ON interview_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interview sessions"
  ON interview_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interview sessions"
  ON interview_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own interview sessions"
  ON interview_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON interview_sessions
  FOR EACH ROW EXECUTE PROCEDURE moddatetime (updated_at);
