# Portfolio Case Study: SwipeHire

## Overview
**SwipeHire** is an open-source, AI-first career platform designed to act as a 24/7 copilot for job seekers. Moving beyond traditional job boards, it leverages Large Language Models (LLMs) to provide real-time resume analysis, personalized job tailoring, and interactive mock interviews.

## The Challenge
Job seekers face a fragmented, demoralizing process. Resumes must be tailored manually for Applicant Tracking Systems (ATS), and interview practice usually requires coordinating with peers. Existing AI solutions are often generic chatbots lacking context about the user's specific career history.

The technical challenge was building a highly responsive, personalized AI application that doesn't feel like a sluggish wrapper, while maintaining strict data privacy.

## The Solution & Architecture
I built SwipeHire using a modern, serverless architecture to ensure rapid iteration and global scale.

**Tech Stack:**
- **Framework**: Next.js 16 (App Router) for hybrid Server/Client rendering.
- **Database**: Supabase (PostgreSQL) for relational data and authentication.
- **AI Intelligence**: Google Gemini API for fast, high-quality reasoning.
- **UI/UX**: Tailwind CSS, shadcn/ui, and Framer Motion for a premium, accessible feel.

## Engineering Deep Dive

### 1. Taming the LLM with Structured JSON
One of the biggest hurdles in AI engineering is handling unpredictable text outputs. For the "Career Chemistry" match scores and the Mock Interview grading system, the UI required strict data structures (numbers, arrays, booleans), not conversational text. 
**Solution**: I engineered strict system prompts instructing Gemini to return `application/json`. The Next.js backend intercepts the response, parses the JSON, and delivers a type-safe object to the React frontend, eliminating UI crashes caused by AI hallucinations.

### 2. Real-Time Streaming for UX
Users shouldn't have to stare at a loading spinner for 10 seconds while the AI rewrites their resume. 
**Solution**: I implemented the Google GenAI SDK to stream tokens directly from the Gemini API to the client. This provides instant visual feedback, making the application feel incredibly fast and responsive.

### 3. Secure Relational Data
Given the sensitive nature of resumes and job applications, data security was paramount.
**Solution**: Rather than relying purely on application-level logic, I utilized Supabase Row Level Security (RLS). Every query is evaluated at the PostgreSQL database level against the user's JWT, guaranteeing that users can only access their own data.

## Impact
SwipeHire demonstrates the ability to architect, build, and deploy a full-stack, production-ready AI application. It showcases a deep understanding of modern React paradigms (Server Components), AI streaming mechanics, and secure database design.
