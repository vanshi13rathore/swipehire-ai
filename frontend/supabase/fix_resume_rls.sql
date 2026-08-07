-- ==========================================
-- 1. DATABASE: resume_versions
-- ==========================================

-- Ensure RLS is enabled on the table
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to make the script idempotent
DROP POLICY IF EXISTS "Users can view their own resumes" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can insert their own resumes" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can update their own resumes" ON public.resume_versions;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON public.resume_versions;

-- Allow users to view only their own resumes
CREATE POLICY "Users can view their own resumes" 
ON public.resume_versions FOR SELECT 
USING (auth.uid() = user_id);

-- Allow users to insert their own resumes
CREATE POLICY "Users can insert their own resumes" 
ON public.resume_versions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own resumes
CREATE POLICY "Users can update their own resumes" 
ON public.resume_versions FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes" 
ON public.resume_versions FOR DELETE 
USING (auth.uid() = user_id);

-- ==========================================
-- 2. STORAGE BUCKET: resumes
-- ==========================================

-- Ensure the resumes bucket exists (public = false for privacy)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Drop existing storage policies
DROP POLICY IF EXISTS "Users can upload their own resume PDF" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resume PDF" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view public resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own resume PDF"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own PDFs
CREATE POLICY "Users can update their own resume PDF"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read ONLY their own PDFs
CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own PDFs
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'resumes' AND 
    (storage.foldername(name))[1] = auth.uid()::text
);
