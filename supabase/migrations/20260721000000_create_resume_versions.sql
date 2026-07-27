CREATE TABLE IF NOT EXISTS resume_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    resume_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own resume versions" 
    ON resume_versions FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resume versions" 
    ON resume_versions FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resume versions" 
    ON resume_versions FOR UPDATE 
    USING (auth.uid() = user_id) 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resume versions" 
    ON resume_versions FOR DELETE 
    USING (auth.uid() = user_id);

-- Create a function to automatically set updated_at
CREATE OR REPLACE FUNCTION update_resume_versions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_resume_versions_timestamp
BEFORE UPDATE ON resume_versions
FOR EACH ROW
EXECUTE FUNCTION update_resume_versions_updated_at();

-- Partial unique index to ensure only one default resume per user
CREATE UNIQUE INDEX one_default_resume_per_user ON resume_versions (user_id) WHERE is_default = true;
