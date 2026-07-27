# Database Architecture

SwipeHire uses Supabase (PostgreSQL) as its primary data store. 

## 1. Database Schema (Entity Relationship)

```mermaid
erDiagram
    USERS ||--o{ RESUME_VERSIONS : owns
    USERS ||--o{ SAVED_JOBS : bookmarks
    USERS ||--o{ APPLICATIONS : tracks
    USERS ||--o{ INTERVIEW_SESSIONS : completes
    USERS ||--o{ CAREER_CHATS : has
    
    USERS {
        uuid id PK
        string email
        string full_name
        jsonb skills
    }
    
    RESUME_VERSIONS {
        uuid id PK
        uuid user_id FK
        boolean is_default
        jsonb resume_data
    }
    
    SAVED_JOBS {
        uuid id PK
        uuid user_id FK
        string job_id
        jsonb job_data
    }
    
    APPLICATIONS {
        uuid id PK
        uuid user_id FK
        string job_id
        string status
    }
    
    INTERVIEW_SESSIONS {
        uuid id PK
        uuid user_id FK
        string role
        integer overall_score
        jsonb feedback
    }
    
    CAREER_CHATS {
        uuid id PK
        uuid user_id FK
        string title
        jsonb messages
    }
```

## 2. Dashboard Analytics Flow

```mermaid
graph TD
    A[Dashboard UI] -->|Parallel Fetch| API(Next.js Server Component)
    API -->|Get Applications| DB1[(Supabase)]
    API -->|Get Interviews| DB2[(Supabase)]
    API -->|Get Saved Jobs| DB3[(Supabase)]
    API -->|Get Goals| DB4[(Supabase)]
    
    DB1 --> API
    DB2 --> API
    DB3 --> API
    DB4 --> API
    
    API -->|Aggregate Metrics| Agg(Aggregator)
    Agg -->|Send Context| LLM{Google Gemini}
    LLM -->|Generate Weekly Insight| Agg
    Agg -->|Pass Props| UI[DashboardCharts & View]
```

## Security (Row Level Security)
Every table implements Row Level Security.
Example RLS Policy:
```sql
CREATE POLICY "Users can only view their own applications" 
ON applications FOR SELECT 
USING (auth.uid() = user_id);
```
