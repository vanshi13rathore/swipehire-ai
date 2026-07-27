# SwipeHire Demo Script (5 Minutes)

**[0:00 - 0:30] The Hook & Problem**
"Hi everyone, I'm excited to show you SwipeHire. 
If you've applied for a job in the last five years, you know the process is broken. You send out a hundred resumes, hear nothing back, and when you finally get an interview, you have no way to practice.
SwipeHire isn't just a job board. It’s an open-source, AI-powered Career Copilot that actively helps you land the job."

**[0:30 - 1:30] The Solution & Job Feed**
"Let's start at the Job Feed. Notice how fast this loads—that's Next.js Server Components at work.
When I click on a job, you'll see a feature we call 'Career Chemistry.' 
Instead of just showing the description, our Gemini AI backend has instantly compared my stored resume against this specific job. It tells me exactly why I'm a match, and highlights the skills I'm missing.
I can save this job, or click apply. When I click apply, our optimistic UI updates instantly while Supabase handles the database transaction in the background."

**[1:30 - 2:30] Resume Tailoring (The Magic)**
"But here is where the magic happens. Let's go to the Resume Builder.
I want to apply for a Senior React Developer role, but my resume is a bit generic. 
I click 'Tailor Resume', paste the job description, and hit generate.
Watch this... *(pause as UI streams)*. Using the Google GenAI SDK, Gemini is streaming a completely rewritten, highly-targeted version of my resume in real-time. It's enhancing my bullet points to match the exact keywords the ATS will look for, without me having to type a single word.
All of this is saved instantly as a new version in our PostgreSQL database."

**[2:30 - 3:30] Mock Interview & Copilot**
"Now, let's say I got the interview. 
I can jump into our Mock Interview module. I select the role, and the AI starts asking me behavioral and technical questions. When I answer, it doesn't just say 'good job.' It analyzes my response using the STAR method—Situation, Task, Action, Result—and grades me on technical depth and communication, providing actionable feedback.
If I'm ever lost, I can open the Career Copilot—a persistent AI chat that has full context of my resume and application history to give me personalized career advice."

**[3:30 - 4:30] Dashboard & Architecture**
"Finally, the Dashboard. Here, I can track my conversion rates and interview scores over time. These charts are lazy-loaded for peak performance.
Under the hood, we are running a highly scalable, serverless architecture. Next.js handles the edge routing, Supabase secures our data with strict Row-Level Security, and Google Gemini powers the intelligence. Because we enforce structured JSON outputs from the LLM, our UI never breaks from unpredictable AI text."

**[4:30 - 5:00] Conclusion**
"SwipeHire is open source, production-ready, and built to scale. It solves a massive pain point using modern AI without compromising on performance or design. 
You can view the live demo or check out the code on GitHub. Thank you."
