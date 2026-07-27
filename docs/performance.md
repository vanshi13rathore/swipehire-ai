# Performance Optimizations

SwipeHire is built to feel lightning-fast, despite relying on heavy asynchronous AI processing.

## Frontend Performance

### 1. Optimistic UI Updates
For actions like updating application statuses in the Kanban board or saving a job, the UI updates immediately assuming success, while the actual API request resolves in the background. This eliminates perceived latency.

### 2. React Server Components & App Router
Next.js 16 App Router is heavily utilized. Server Components reduce the JavaScript bundle size shipped to the client, leading to faster Time to Interactive (TTI) and better SEO.

### 3. Smart Asset Loading
- `next/image` is used for all imagery to ensure modern formats (WebP/AVIF) and responsive sizing.
- Fonts are self-hosted via `next/font` to eliminate layout shift (CLS).

## Backend & AI Performance

### 1. Edge Streaming
AI generation (like the Mock Interview scoring or full resume tailoring) can take 5-15 seconds. Instead of a blocking request or relying on background queue workers like Redis/Celery, SwipeHire leverages Next.js API Routes and the Google GenAI SDK to stream the response back to the client token-by-token. This keeps the main thread unblocked and provides instant perceived performance.

### 2. Edge Caching
Static assets and non-personalized data are cached at the Vercel Edge Network.

### 3. Prompt Optimization
Gemini API calls are optimized by:
- Using strict system instructions to limit token output generation to exactly what is needed (e.g., forcing JSON output).
- Caching common context (if supported by the specific model version).

## Database Performance

- **Indexing**: Frequent lookup columns (like `user_id` on applications and resumes) are heavily indexed in PostgreSQL.
- **Connection Pooling**: Supabase provides PgBouncer connection pooling out of the box, preventing database connection exhaustion during traffic spikes.
