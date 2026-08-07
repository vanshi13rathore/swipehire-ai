-- Create smart_recommendations table
CREATE TABLE smart_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  job_id text NOT NULL, -- Storing as text since real jobs are currently mock/external API
  score integer NOT NULL,
  explanation jsonb NOT NULL,
  generated_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '7 days') NOT NULL
);

-- Enable RLS
ALTER TABLE smart_recommendations ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can view own recommendations"
  ON smart_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendations"
  ON smart_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendations"
  ON smart_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendations"
  ON smart_recommendations FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster lookups by user and job
CREATE INDEX idx_smart_recommendations_user_job ON smart_recommendations(user_id, job_id);
