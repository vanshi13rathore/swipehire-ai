import { useState, useCallback, useEffect } from "react";
import type { Job } from "@/lib/ai/types";
import { supabase } from "@/lib/supabase/client";

export interface SwipeDecision {
  jobId: string;
  action: "skip" | "interested" | "dream-job";
  timestamp: number;
}

export function useSwipe() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<SwipeDecision[]>([]);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      try {
        const res = await fetch("/api/jobs");
        const allJobs: Job[] = await res.json();

        const [{ data: saved }, { data: passed }] = await Promise.all([
          supabase.from("saved_jobs").select("job_id").eq("user_id", user.id),
          supabase.from("passed_jobs").select("job_id").eq("user_id", user.id),
        ]);

        const savedIds = new Set(saved?.map(s => s.job_id) || []);
        const passedIds = new Set(passed?.map(p => p.job_id) || []);

        const unseenJobs = allJobs.filter(job => !savedIds.has(job.id) && !passedIds.has(job.id));
        setJobs(unseenJobs);
      } catch (err) {
        console.error("Failed to load jobs", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const handleSwipe = useCallback(async (direction: 'left' | 'right' | 'up') => {
    const actionMap = {
      left: "skip" as const,
      right: "interested" as const,
      up: "dream-job" as const
    };

    setJobs((prev) => {
      const current = prev[0];
      if (current) {
        setDecisions(d => [...d, {
          jobId: current.id,
          action: actionMap[direction],
          timestamp: Date.now()
        }]);

        if (userId) {
          if (direction === 'right' || direction === 'up') {
            supabase.from('saved_jobs').insert({
              user_id: userId,
              job_id: current.id,
              job_data: current
            }).then(({ error }) => {
              if (error) console.error("Error saving job:", error);
            });
          } else if (direction === 'left') {
            supabase.from('passed_jobs').insert({
              user_id: userId,
              job_id: current.id
            }).then(({ error }) => {
              if (error) console.error("Error passing job:", error);
            });
          }
        }
      }
      return prev.slice(1);
    });
  }, [userId]);

  const handleReset = useCallback(() => {
    // Only resets local session view, won't un-swipe persisted jobs
    setDecisions([]);
  }, []);

  const currentJob = jobs.length > 0 ? jobs[0] : null;

  return {
    jobs,
    currentJob,
    handleSwipe,
    handleReset,
    loading,
    decisions
  };
}
