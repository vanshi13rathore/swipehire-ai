-- Migration: Infrastructure (Rate Limiting & Caching)

-- ==========================================
-- AI RESPONSE CACHE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ai_response_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cache_key text NOT NULL,
  response_data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for fast cache lookups and cleanup
CREATE INDEX IF NOT EXISTS ai_response_cache_lookup_idx ON public.ai_response_cache(user_id, cache_key);
CREATE INDEX IF NOT EXISTS ai_response_cache_expires_idx ON public.ai_response_cache(expires_at);

-- RLS
ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own cache"
  ON public.ai_response_cache
  FOR ALL
  USING (auth.uid() = user_id);

-- ==========================================
-- RATE LIMITING
-- ==========================================
CREATE TABLE IF NOT EXISTS public.api_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  request_count integer DEFAULT 1,
  window_start timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS api_rate_limits_user_endpoint_idx ON public.api_rate_limits(user_id, endpoint);

-- RLS
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;

-- Note: The Edge Function or Server Action will bypass RLS via Service Role Key 
-- for rate limiting, but we still add a policy for user reads just in case.
CREATE POLICY "Users can read their own limits"
  ON public.api_rate_limits
  FOR SELECT
  USING (auth.uid() = user_id);

-- ==========================================
-- CRON FUNCTION (Optional Helper)
-- ==========================================
-- Cleans up expired cache entries (can be run via pg_cron or external trigger)
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.ai_response_cache WHERE expires_at < now();
END;
$$;
