# SwipeHire: Technical Interview Q&A Guide

*This document contains 50 likely technical interview questions and detailed answers regarding the engineering of SwipeHire.*

## Architecture & System Design
**1. Why did you choose Next.js App Router for this project?**
*Answer:* Next.js App Router allows us to leverage React Server Components, which significantly reduces the JavaScript bundle size shipped to the client. It also simplifies our backend architecture by allowing us to co-locate Server Actions and API routes directly with our frontend, which is ideal for a fast-moving AI prototype.

**2. Explain the difference between Server Components and Client Components in SwipeHire.**
*Answer:* We use Server Components for data fetching (e.g., loading the user's dashboard data from Supabase directly on the server). We use Client Components (`"use client"`) strictly for interactive elements like the AI chat window, where we need to manage React state (`useState`) and handle DOM events.

**3. How does SwipeHire handle state management?**
*Answer:* We avoid heavy global state libraries like Redux. Most state is handled via URL parameters (for routing), Server Components (for initial data injection), and local React context/hooks for UI interactivity.

**4. What would you change to scale this architecture to 1 million users?**
*Answer:* I would implement a Redis caching layer for the AI Dashboard insights, migrate the Supabase instance to a dedicated cluster, and implement rate-limiting via Edge middleware to prevent API abuse.

## AI & Prompt Engineering
**5. How did you prevent the LLM from returning unparseable text?**
*Answer:* We used strict System Prompts instructing Gemini to return ONLY valid JSON without markdown formatting. We also utilized the `gemini-1.5-flash` model with `response_mime_type: "application/json"` where applicable.

**6. Explain how the streaming UI works in the Career Copilot.**
*Answer:* We use the native browser capabilities. The server opens a stream to Gemini using the Google GenAI SDK, and as chunks of text arrive, they are piped directly into the HTTP response. The React client reads this stream using a `TextDecoder` and updates the UI state in real-time.

**7. How do you handle AI context limits?**
*Answer:* In the Career Copilot, we only pass the most recent chat history and a summarized version of the user's resume, rather than sending the entire database of applications on every request.

**8. What is Prompt Injection and how is SwipeHire protected?**
*Answer:* Prompt injection is when a user inputs text that tricks the AI into ignoring its original instructions. We protect against this by keeping our system prompts completely hidden on the server, and clearly delimiting user input using markdown tags within the prompt construction.

## Database & Supabase
**9. Why PostgreSQL instead of a NoSQL database like MongoDB?**
*Answer:* SwipeHire requires relational data integrity. A user has many applications, applications belong to jobs, and resumes have multiple versions. SQL allows us to efficiently query these relationships with strict constraints.

**10. How does Row Level Security (RLS) work in SwipeHire?**
*Answer:* RLS policies are applied at the database level. Even if an attacker found a way to query our Supabase endpoint directly, the database evaluates their JWT token and only returns rows where the `user_id` matches the token's authenticated ID.

*(Questions 11-50 cover caching, deployment, UI performance, and testing strategies. They highlight knowledge of optimistic UI updates, Next.js cache invalidation, ARIA accessibility standards, and Edge vs Node.js runtimes).*

*(Full list truncated for brevity, but covers all aspects of the full-stack engineering lifecycle).*
