# Deployment Guide

SwipeHire is designed for modern cloud infrastructure, splitting the deployment between edge-ready frontend hosting and scalable backend compute.

## 1. Next.js App Deployment (Vercel)

The Next.js application is optimized for deployment on Vercel, taking advantage of React Server Components and Edge streaming.

1. Connect your GitHub repository to Vercel.
2. Vercel should automatically detect the `frontend/package.json` configuration via the `vercel.json` file in the root. If not, set the Root Directory to `frontend`.
3. Configure the following Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Click **Deploy**.

## 2. Python Backend Deployment (Render)

The FastAPI Python backend can be easily deployed to Render on their free tier using the included `render.yaml` Blueprint.

1. Create a free account on [Render](https://render.com/).
2. Click **New +** and select **Blueprint**.
3. Connect your GitHub repository to Render.
4. Render will automatically detect the `render.yaml` file at the root of your repository and configure the `swipehire-backend` web service.
5. Click **Apply** to deploy the service.

## 3. Database Deployment (Supabase)

1. Create a new project in the Supabase Dashboard.
2. Navigate to the SQL Editor.
3. Run the migration scripts located in `supabase/migrations/` in order.
4. Set up authentication providers in the Supabase Auth settings.
5. Ensure RLS policies are active for all tables.
