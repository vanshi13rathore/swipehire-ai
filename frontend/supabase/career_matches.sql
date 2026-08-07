-- Create the career_matches table for caching Career Chemistry matches
CREATE TABLE IF NOT EXISTS public.career_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resume_version_id UUID NOT NULL REFERENCES public.resume_versions(id) ON DELETE CASCADE,
    job_id UUID NOT NULL, -- Logical reference to jobs (either external or internal table)
    
    -- Numeric Scores (0-100)
    overall_score INTEGER NOT NULL,
    skills_score INTEGER NOT NULL,
    experience_score INTEGER NOT NULL,
    education_score INTEGER NOT NULL,
    keyword_score INTEGER NOT NULL,
    
    -- AI Generated Content
    explanation JSONB,
    recommendations JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Prevent duplicate calculations for the same resume and job
    CONSTRAINT uq_resume_job UNIQUE (resume_version_id, job_id)
);

-- Enable RLS
ALTER TABLE public.career_matches ENABLE ROW LEVEL SECURITY;

-- Idempotent Policy Drops
DROP POLICY IF EXISTS "Users can view their own matches" ON public.career_matches;
DROP POLICY IF EXISTS "Users can insert their own matches" ON public.career_matches;
DROP POLICY IF EXISTS "Users can update their own matches" ON public.career_matches;
DROP POLICY IF EXISTS "Users can delete their own matches" ON public.career_matches;

-- Select Policy
CREATE POLICY "Users can view their own matches"
ON public.career_matches FOR SELECT
USING (auth.uid() = user_id);

-- Insert Policy
CREATE POLICY "Users can insert their own matches"
ON public.career_matches FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Update Policy
CREATE POLICY "Users can update their own matches"
ON public.career_matches FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Delete Policy
CREATE POLICY "Users can delete their own matches"
ON public.career_matches FOR DELETE
USING (auth.uid() = user_id);
