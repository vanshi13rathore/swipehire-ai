# SwipeHire: Project Showcase

## 🎯 Problem Statement
The modern job search is broken. Candidates send hundreds of resumes into ATS black holes, struggle to tailor applications for specific roles, and rarely get actionable feedback on their interview skills. Existing platforms are merely job boards; they don't actively *help* you get the job.

## 💡 Why SwipeHire Exists
SwipeHire was built to democratize access to elite career coaching. By wrapping Google Gemini AI in a beautiful, highly responsive interface, SwipeHire acts as a 24/7 Career Copilot. It helps users analyze job descriptions, intelligently rewrite their resumes, and practice mock interviews in a safe, constructive environment.

## 🏗 Architecture Decisions
- **Next.js App Router**: Chosen for its seamless blend of Server Components (for fast data fetching) and Client Components (for interactive AI streams).
- **Supabase**: Selected over Firebase for its robust PostgreSQL foundation, enabling complex relational queries (e.g., joining user profiles with application history) while maintaining strict Row Level Security (RLS).
- **Google GenAI SDK**: Implemented to handle the complex boilerplate of streaming LLM responses natively, significantly improving perceived performance for the end-user.

## ⚙️ Engineering Challenges & Tradeoffs
- **Challenge: AI Hallucinations in Resume Data**
  - *Solution*: Instead of relying purely on text generation, we forced Gemini to return structured JSON. The UI then strictly validates and maps this JSON to our UI components.
- **Tradeoff: Client vs. Server AI Calls**
  - *Decision*: We routed all AI calls through Next.js API Routes rather than calling Gemini directly from the browser. 
  - *Reasoning*: While client-side calls would reduce our server load, routing through the backend secures the API key and allows us to inject server-side context (like database history) before the LLM sees the prompt.

## 🚀 Performance Optimizations
- **Lazy Loading Heavy Charts**: The `DashboardCharts` component relies on `recharts`, a heavy library. We implemented `next/dynamic` to lazy load these charts, keeping the initial bundle size small and ensuring fast First Contentful Paint (FCP).
- **Optimistic UI**: When users save a job or submit an application, the UI updates instantly while the Supabase mutation happens in the background, making the app feel incredibly fast.

## 🔒 Security Decisions
- **Row Level Security (RLS)**: Every single table in Supabase enforces strict RLS policies. A user can *only* query, insert, or modify rows where `user_id == auth.uid()`.
- **API Route Validation**: All Next.js API routes verify the user's session token before processing AI requests, preventing unauthorized abuse of our Gemini API quotas.

## 📚 Lessons Learned
1. **Streaming is Mandatory for UX**: Waiting 5 seconds for a complete AI response feels like an eternity. Streaming the response token-by-token changed the entire feel of the application from "clunky" to "alive."
2. **Prompt Engineering is Code**: Maintaining AI prompts as strict, version-controlled constants with clear typing boundaries was crucial to preventing the application from breaking when the LLM returned unexpected formats.

## 🔮 Future Scope
- **WebRTC Voice Interviews**: Upgrading the Mock Interview feature from text-based to real-time voice conversations using the Web Speech API and low-latency LLM models.
- **Enterprise ATS Integration**: Allowing users to apply to jobs with a single click by integrating with APIs from Greenhouse and Lever.
