# Supabase Integration (Architecture Placeholder)

This directory is reserved for future Supabase integration.

## Purpose

The `lib/supabase` directory acts as the central hub for all Supabase-related configurations, clients, and type definitions. It abstracts the database and authentication layers away from the Next.js UI components.

## Future Files

The following files will be implemented in subsequent tickets when backend integration begins:

- **`client.ts`**: Will contain the Supabase client initialization for browser/client-side components using `@supabase/ssr`.
- **`server.ts`**: Will contain the Supabase client initialization for Server Components, Server Actions, and Route Handlers.
- **`middleware.ts`**: Will handle session refresh and route protection at the edge.
- **`database.types.ts`**: Will contain the auto-generated TypeScript definitions pulled directly from the Supabase CLI (`supabase gen types typescript`).
- **`types.ts`**: Contains our domain-specific types (currently placeholders) that wrap or extend the raw database types.
