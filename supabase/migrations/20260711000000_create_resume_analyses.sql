-- Create resume_analyses table
CREATE TABLE resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resume_filename text NOT NULL,
  resume_updated_at timestamptz NOT NULL,
  analysis jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT resume_analyses_unique_key UNIQUE (user_id, resume_filename, resume_updated_at)
);

-- Create indexes
CREATE INDEX idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX idx_resume_analyses_resume_updated_at ON resume_analyses(resume_updated_at);

-- Enable Row Level Security
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can select their own resume analyses"
ON resume_analyses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume analyses"
ON resume_analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume analyses"
ON resume_analyses FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume analyses"
ON resume_analyses FOR DELETE
USING (auth.uid() = user_id);
