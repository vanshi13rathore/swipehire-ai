INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;


-- Allow users to upload their own resumes
CREATE POLICY "Users can upload their own resume" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to update their own resumes
CREATE POLICY "Users can update their own resume" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resume" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access to resumes (since they are in a public bucket)
CREATE POLICY "Resume files are public" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'resumes');
