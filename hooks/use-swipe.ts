import { useState, useCallback } from "react";
import { Job } from "@/types";
import { MOCK_JOBS } from "@/constants/jobs";

export function useSwipe(initialJobs: Job[] = MOCK_JOBS) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  const handleSwipe = useCallback(() => {
    setJobs((prev) => prev.slice(1));
  }, []);

  const currentJob = jobs.length > 0 ? jobs[0] : null;

  return {
    jobs,
    currentJob,
    handleSwipe,
  };
}
