CREATE TABLE IF NOT EXISTS passed_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id TEXT NOT NULL,
    passed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, job_id)
);

ALTER TABLE passed_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own passed jobs."
ON passed_jobs FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own passed jobs."
ON passed_jobs FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own passed jobs."
ON passed_jobs FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_passed_jobs_user_id ON passed_jobs(user_id);
