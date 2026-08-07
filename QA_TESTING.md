# SwipeHire QA Engineering Checklist

This checklist must be completely verified before any production deployment. 
It ensures that SwipeHire maintains a high standard of reliability, security, and user experience.

## 1. Authentication & Security
- [ ] **Sign up:** New users can create an account and receive confirmation.
- [ ] **Login:** Existing users can log in successfully.
- [ ] **Logout:** User sessions are destroyed completely on logout.
- [ ] **Session Persistence:** Refreshing the page does not log the user out.
- [ ] **Protected Routes:** Attempting to access `/dashboard` while logged out redirects to `/login`.
- [ ] **Data Leakage:** Users cannot view resumes or jobs belonging to other `user_id`s.
- [ ] **RLS Enforcement:** Attempting to query the Supabase database directly without an active session fails.

## 2. Resume Management
- [ ] **Upload Success:** Valid PDFs are uploaded and parsed correctly.
- [ ] **Upload Invalid PDF:** Uploading a `.docx` or corrupted PDF triggers a graceful error message.
- [ ] **Upload Oversized PDF:** Uploading a PDF larger than 5MB triggers a file size limit warning.
- [ ] **Delete:** Resumes are deleted from both the database (`resume_versions`) and the storage bucket.
- [ ] **Duplicate:** Users can duplicate an existing resume.
- [ ] **Edit Name:** Users can rename a resume version.
- [ ] **Set Default:** A user can set a new default resume, and the previous default is correctly unset (enforced by the `one_default_resume_per_user` constraint).

## 3. AI Modules
- [ ] **Resume Analysis:** The LLM successfully extracts JSON structured data from the PDF text.
- [ ] **Hybrid ATS Score:** The ATS score accurately reflects formatting, quantifiable achievements, and keywords.
- [ ] **Career DNA:** The Career DNA component generates accurate strengths and weaknesses.
- [ ] **Job Recommendations:** The system suggests realistic job titles based on the resume.
- [ ] **Mock Interview:** The AI can generate targeted interview questions based on the extracted experience.

## 4. UI / UX Dashboard
- [ ] **Charts:** Any data visualization components render without crashing.
- [ ] **Responsive Layout:** The dashboard works on mobile (iPhone 14 width) and desktop without horizontal scrolling.
- [ ] **Empty States:** "No resumes found" states include a clear Call-to-Action to upload one.
- [ ] **Loading States:** Skeletons or spinners appear while the AI is analyzing the resume.
- [ ] **Accessibility:** All buttons and inputs are keyboard navigable and have sufficient color contrast.

## 5. Performance
- [ ] **Resume Analysis Latency:** The end-to-end PDF parsing and Gemini extraction completes in under 10 seconds.
- [ ] **Database Latency:** Page loads execute necessary SQL queries in under 500ms.
