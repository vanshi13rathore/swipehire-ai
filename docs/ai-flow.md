# AI Pipelines and Data Flows

SwipeHire integrates Google Gemini for multiple distinct AI workflows. Below are the architectural flow diagrams for each primary AI feature.

## 1. AI Request Lifecycle

```mermaid
sequenceDiagram
    participant C as Client (Browser)
    participant API as Next.js API Route
    participant DB as Supabase (PostgreSQL)
    participant LLM as Google Gemini API

    C->>API: POST /api/chat { message }
    API->>API: Validate session & rate limit
    API->>DB: Fetch user context (resume, jobs)
    DB-->>API: Context JSON
    API->>API: Compile System Prompt + Context + Message
    API->>LLM: Stream completion request
    LLM-->>API: Stream chunks (Server-Sent Events)
    API-->>C: Stream tokens back to UI
    C->>C: React updates UI optimistically
    API->>DB: Async save final message to DB
```

## 2. Resume Analysis Flow

```mermaid
graph TD
    A[User Uploads PDF / Submits Text] -->|Extract Text| B(API Route)
    B -->|Fetch Gemini| C{Prompt: Analyze Resume}
    C -->|JSON Output| D[Extract Skills, Experience, Education]
    D --> E[Calculate ATS Score]
    E -->|Save| F[(Supabase: resume_versions)]
    F -->|Return Data| G[UI: Resume Builder Dashboard]
```

## 3. Resume Tailoring Flow

```mermaid
graph TD
    User[User] -->|Pastes Job Description| App(Resume Builder UI)
    App -->|POST /api/tailor| API(Next.js API)
    API -->|Fetch DB| DB[(Supabase)]
    DB -->|Return base resume| API
    API -->|Send Resume + Job Desc| LLM{Google Gemini}
    LLM -->|Stream JSON/Text| API
    API -->|Stream| App
    App -->|Update Form State| App
    App -->|User Reviews & Saves| DB2[(Supabase: New Version)]
```

## 4. Career Copilot Flow

```mermaid
graph LR
    User((User)) -->|Types Message| ChatUI[Copilot Chat]
    ChatUI -->|Message History| API[Next.js API]
    API <-->|R/W Chat History| DB[(Supabase)]
    API <-->|R/W Context (Saved Jobs/Resumes)| DB
    API -->|Prompt + Context| Gemini[Google Gemini]
    Gemini -->|Streaming Response| ChatUI
```

## 5. Mock Interview Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Interview UI
    participant API as Next.js API
    participant LLM as Google Gemini
    participant DB as Supabase

    User->>UI: Start Interview (Select Role)
    UI->>API: Generate Questions
    API->>LLM: Prompt: Create 5 role-specific questions
    LLM-->>UI: Return JSON Questions
    User->>UI: Answer Question (Text/Audio)
    UI->>API: Evaluate Answer
    API->>LLM: Prompt: Grade via STAR method
    LLM-->>UI: Return JSON Feedback & Score
    UI->>DB: Save Interview Session
    UI-->>User: Display Results & Suggestions
```
