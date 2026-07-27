# System Architecture

SwipeHire is built on a modern, decoupled serverless architecture to ensure rapid global delivery, secure data management, and responsive AI integrations.

## 1. High-Level System Architecture

```mermaid
graph TD
    Client[Web Client - Next.js] -->|App Router| UI(React Server Components)
    UI -->|API Routes / Server Actions| Backend(Next.js Backend)
    
    Backend -->|PostgreSQL / Auth| DB[(Supabase)]
    Backend -->|Streaming Completion| AI(Google Gemini API)
    
    DB --> Storage(Resume PDF/Storage)
```

## 2. Authentication Flow

SwipeHire leverages Supabase Auth for seamless user identity management.

```mermaid
sequenceDiagram
    participant User
    participant App as Next.js Client
    participant Server as Next.js Server / Middleware
    participant Auth as Supabase Auth

    User->>App: Submits Login (Email/Password or OAuth)
    App->>Auth: Authenticate Credentials
    Auth-->>App: Return JWT Session Token
    App->>App: Set Secure HttpOnly Cookie
    App->>Server: Request Protected Route (e.g., /dashboard)
    Server->>Auth: Validate JWT via Supabase Admin
    Auth-->>Server: Token Valid
    Server-->>App: Render Protected Content
    App-->>User: Display Dashboard
```
