"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { JobCard } from "./job-card";
import { JobFilters, JobFilterState, defaultFilterState } from "./job-filters";
import type { RecommendedJob, Job, JobWithScores } from "@/lib/ai/types";
import { getSavedJobIds, saveJob, unsaveJob, isJobSaved } from "@/lib/supabase/saved-jobs";
import { getAppliedJobIds, applyToJob, isApplied } from "@/lib/supabase/applications";
import { Briefcase, MapPin, Sparkles, TrendingUp } from "lucide-react";
import { useInView } from "react-intersection-observer";

export interface JobFeedProps {
  jobs?: JobWithScores[];
  loading?: boolean;
  hasResume?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function JobFeed({ jobs = [], loading = false, hasResume = true }: JobFeedProps) {
  const router = useRouter();
  const [savedJobIds, setSavedJobIds] = React.useState<string[]>([]);
  const [appliedJobIds, setAppliedJobIds] = React.useState<string[]>([]);
  const [loadingState, setLoadingState] = React.useState(true);
  const [filters, setFilters] = React.useState<JobFilterState>(defaultFilterState);
  const [visibleCount, setVisibleCount] = React.useState(ITEMS_PER_PAGE);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  React.useEffect(() => {
    async function loadData() {
      try {
        const [savedIds, appliedIds] = await Promise.all([
          getSavedJobIds(),
          getAppliedJobIds()
        ]);
        setSavedJobIds(savedIds);
        setAppliedJobIds(appliedIds);
      } catch (err) {
        console.error("Failed to load user state:", err);
      } finally {
        setLoadingState(false);
      }
    }
    loadData();
  }, []);

  React.useEffect(() => {
    if (inView) {
      const id = setTimeout(() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE), 0);
      return () => clearTimeout(id);
    }
  }, [inView]);

  const handleSaveToggle = async (job: Job | RecommendedJob) => {
    const currentlySaved = isJobSaved(job.id, savedJobIds);
    setSavedJobIds(prev => currentlySaved ? prev.filter(id => id !== job.id) : [...prev, job.id]);
    try {
      if (currentlySaved) await unsaveJob(job.id);
      else await saveJob(job as Job);
    } catch (err) {
      console.error("Failed to toggle saved job:", err);
      setSavedJobIds(prev => currentlySaved ? [...prev, job.id] : prev.filter(id => id !== job.id));
    }
  };

  const handleApply = async (job: Job | RecommendedJob) => {
    if (isApplied(job.id, appliedJobIds)) return;
    setAppliedJobIds(prev => [...prev, job.id]);
    try {
      await applyToJob(job as Job);
    } catch (err) {
      console.error("Failed to apply to job:", err);
      setAppliedJobIds(prev => prev.filter(id => id !== job.id));
    }
  };

  // --- Filter Logic ---
  const filteredJobs = React.useMemo(() => {
    return jobs.filter((job) => {
      // Search (Title, Company, Skills)
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.name.toLowerCase().includes(query);
        const matchesSkills = job.skills.some(s => s.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }

      // Location
      if (filters.location !== "All Locations") {
        if (filters.location === "Remote" && !job.isRemote && !job.location.toLowerCase().includes("remote")) return false;
        if (filters.location !== "Remote" && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      }

      // Experience
      if (filters.experience !== "All" && job.experienceLevel !== filters.experience) {
        // Simple mapping check since exact string might differ
        const eLower = (job.experienceLevel || "").toLowerCase();
        const fLower = filters.experience.toLowerCase();
        if (fLower === "senior" && !eLower.includes("senior") && !eLower.includes("lead")) return false;
        if (fLower === "entry level" && !eLower.includes("entry") && !eLower.includes("junior")) return false;
        if (fLower === "mid-level" && !eLower.includes("mid")) return false;
      }

      // Work Mode
      if (filters.workMode !== "All") {
        const m = filters.workMode.toLowerCase();
        if (m === "remote" && !job.isRemote) return false;
        if (m === "on-site" && job.isRemote) return false;
      }

      // Employment Type
      if (filters.employmentType !== "All") {
        const t = (job.employmentType || "").toLowerCase();
        if (!t.includes(filters.employmentType.toLowerCase())) return false;
      }

      // AI Match
      if (filters.aiMatch !== "All") {
        const threshold = parseInt(filters.aiMatch.replace("%+", ""));
        const score = job.chemistryScore || 0;
        if (score < threshold) return false;
      }

      // Salary (Naive parse for demo)
      if (filters.salary !== "Any") {
        const sal = job.salary.toLowerCase();
        if (sal === "competitive" || sal === "unpaid") return false; // Hide competitive if salary filter applies
      }

      // Skills (Must have ALL selected skills)
      if (filters.skills.length > 0) {
        const hasAllSkills = filters.skills.every(fs => 
          job.skills.some(js => js.toLowerCase() === fs.toLowerCase())
        );
        if (!hasAllSkills) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  // --- Sorting Logic ---
  const sortedJobs = React.useMemo(() => {
    return [...filteredJobs].sort((a, b) => {
      switch (filters.sortBy) {
        case "Newest":
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case "Company Name":
          return a.company.name.localeCompare(b.company.name);
        case "AI Match":
        default:
          const scoreA = a.chemistryScore || 0;
          const scoreB = b.chemistryScore || 0;
          return scoreB - scoreA;
      }
    });
  }, [filteredJobs, filters.sortBy]);

  // Analytics Metrics
  const totalJobs = filteredJobs.length;
  const remoteJobsCount = filteredJobs.filter(j => j.isRemote).length;
  const avgMatch = filteredJobs.length > 0 
    ? Math.round(filteredJobs.reduce((acc, job) => acc + (job.chemistryScore || 0), 0) / filteredJobs.length)
    : 0;
  
  // Recommended top 3
  const topRecommended = [...jobs]
    .sort((a, b) => {
      const sA = a.chemistryScore || 0;
      const sB = b.chemistryScore || 0;
      return sB - sA;
    })
    .slice(0, 3);

  const visibleJobs = sortedJobs.slice(0, visibleCount);

  if (loading || loadingState) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mx-auto">
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCard key={`skeleton-${i}`} loading />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full mx-auto pb-20">
      
      {/* Analytics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Jobs Available</p>
            <p className="text-2xl font-bold">{totalJobs}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Average Match</p>
            <p className="text-2xl font-bold">{hasResume ? `${avgMatch}%` : 'N/A'}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">Remote Jobs</p>
            <p className="text-2xl font-bold">{remoteJobsCount}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-medium">New Today</p>
            <p className="text-2xl font-bold">27</p>
          </div>
        </div>
      </div>

      <JobFilters 
        filters={filters} 
        onChange={(newFilters) => {
          setFilters(newFilters);
          setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on filter change
        }}
        onReset={() => setFilters(defaultFilterState)}
        totalJobsCount={filteredJobs.length}
      />

      {/* Recommended For You Section */}
      {filters === defaultFilterState && topRecommended.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRecommended.map((job) => (
              <JobCard 
                key={`rec-${job.id}`} 
                job={job} 
                matchPercentage={job.chemistryScore}
                hasResume={hasResume}
                featured={true}
                saved={isJobSaved(job.id, savedJobIds)}
                applied={isApplied(job.id, appliedJobIds)}
                onSave={() => handleSaveToggle(job)}
                onApply={() => handleApply(job)}
                onClick={() => router.push(`/jobs/${job.id}`)}
                onView={() => router.push(`/jobs/${job.id}`)}
                className="cursor-pointer hover:-translate-y-1 transition-all max-w-none"
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Job Feed */}
      <h2 className="text-xl font-bold mb-4">All Matches</h2>
      {sortedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl border-border bg-secondary/10 w-full mx-auto">
          <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            We couldn&apos;t find any opportunities matching your current filters.
          </p>
          <button 
            onClick={() => setFilters(defaultFilterState)}
            className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 w-full mx-auto">
            {visibleJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                matchPercentage={job.chemistryScore}
                hasResume={hasResume}
                saved={isJobSaved(job.id, savedJobIds)}
                applied={isApplied(job.id, appliedJobIds)}
                onSave={() => handleSaveToggle(job)}
                onApply={() => handleApply(job)}
                onClick={() => router.push(`/jobs/${job.id}`)}
                onView={() => router.push(`/jobs/${job.id}`)}
                className="cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all max-w-none"
              />
            ))}
          </div>
          
          {visibleCount < sortedJobs.length && (
            <div ref={ref} className="w-full flex justify-center p-8 mt-4">
              <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
