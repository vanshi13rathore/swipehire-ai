import * as React from "react";
import { Search, MapPin, Briefcase, Globe, DollarSign, Sparkles, Code2, SlidersHorizontal, X, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/shared";

export interface JobFilterState {
  search: string;
  location: string;
  experience: string;
  workMode: string;
  employmentType: string;
  salary: string;
  aiMatch: string;
  skills: string[];
  sortBy: string;
}

export const defaultFilterState: JobFilterState = {
  search: "",
  location: "All Locations",
  experience: "All",
  workMode: "All",
  employmentType: "All",
  salary: "Any",
  aiMatch: "All",
  skills: [],
  sortBy: "AI Match",
};

export interface JobFiltersProps {
  filters: JobFilterState;
  onChange: (filters: JobFilterState) => void;
  onReset: () => void;
  totalJobsCount: number;
}

const LOCATIONS = ["All Locations", "Remote", "India", "USA", "UK", "Canada", "Australia", "Europe", "Asia"];
const EXPERIENCES = ["All", "Internship", "Fresher", "Entry Level", "Junior", "Mid-Level", "Senior", "Lead"];
const WORK_MODES = ["All", "Remote", "Hybrid", "On-site"];
const EMPLOYMENT_TYPES = ["All", "Full-time", "Internship", "Part-time", "Contract", "Freelance"];
const SALARIES = ["Any", "₹5 LPA+", "₹10 LPA+", "₹20 LPA+", "₹30 LPA+", "₹50 LPA+"];
const AI_MATCHES = ["All", "90%+", "80%+", "70%+", "60%+", "50%+"];
const SORT_OPTIONS = ["AI Match", "Newest", "Salary High to Low", "Salary Low to High", "Company Name"];
const POPULAR_SKILLS = ["Python", "Java", "React", "Node.js", "Next.js", "SQL", "AWS", "Docker", "Kubernetes", "Machine Learning", "TypeScript", "Go", "TensorFlow", "LLMs"];

export const JobFilters = React.memo(function JobFilters({ filters, onChange, onReset, totalJobsCount }: JobFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
  
  const updateFilter = React.useCallback((key: keyof JobFilterState, value: JobFilterState[keyof JobFilterState]) => {
    onChange({ ...filters, [key]: value });
  }, [filters, onChange]);

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    updateFilter("skills", newSkills);
  };

  // Compute active filters
  const activeFilterChips = React.useMemo(() => {
    const chips: { key: keyof JobFilterState, value: string, label: string }[] = [];
    if (filters.location !== "All Locations") chips.push({ key: 'location', value: "All Locations", label: filters.location });
    if (filters.experience !== "All") chips.push({ key: 'experience', value: "All", label: filters.experience });
    if (filters.workMode !== "All") chips.push({ key: 'workMode', value: "All", label: filters.workMode });
    if (filters.employmentType !== "All") chips.push({ key: 'employmentType', value: "All", label: filters.employmentType });
    if (filters.salary !== "Any") chips.push({ key: 'salary', value: "Any", label: filters.salary });
    if (filters.aiMatch !== "All") chips.push({ key: 'aiMatch', value: "All", label: `Match: ${filters.aiMatch}` });
    filters.skills.forEach(skill => {
      chips.push({ key: 'skills', value: skill, label: skill });
    });
    return chips;
  }, [filters]);

  const handleRemoveChip = (chip: { key: keyof JobFilterState, value: string }) => {
    if (chip.key === 'skills') {
      toggleSkill(chip.value);
    } else {
      updateFilter(chip.key, chip.value);
    }
  };

  return (
    <>
      {/* Desktop Filter Container */}
      <div className="w-full bg-card/90 backdrop-blur-md border border-border rounded-2xl shadow-lg z-20 mb-8 transition-all">
        <div className="p-4 md:p-6 space-y-4">
          
          {/* Top Row: Search & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search by title, company, or keywords..." 
                className="pl-10 h-12 bg-background border-border/50 text-base rounded-xl focus:ring-primary"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
              />
            </div>
            <Button 
              variant={isMobileFiltersOpen ? "primary" : "outline"} 
              className="md:hidden h-12 px-4 rounded-xl transition-colors"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Active Filter Chips */}
          {activeFilterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 hidden md:flex">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Active:</span>
              {activeFilterChips.map((chip, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {chip.label}
                  <button onClick={() => handleRemoveChip(chip)} className="hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={onReset} className="text-xs font-medium text-muted-foreground hover:text-foreground ml-2 underline underline-offset-2">
                Clear all
              </button>
            </div>
          )}

          {/* Desktop Filters Area */}
          <div className="hidden md:block transition-all">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={filters.location}
                  onChange={(e) => updateFilter("location", e.target.value)}
                >
                  {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Experience
                </label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={filters.experience}
                  onChange={(e) => updateFilter("experience", e.target.value)}
                >
                  {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                </select>
              </div>

              {/* Work Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Work Mode
                </label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={filters.workMode}
                  onChange={(e) => updateFilter("workMode", e.target.value)}
                >
                  {WORK_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
                </select>
              </div>

              {/* Employment Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" /> Type
                </label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={filters.employmentType}
                  onChange={(e) => updateFilter("employmentType", e.target.value)}
                >
                  {EMPLOYMENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              {/* Salary */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5" /> Salary
                </label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={filters.salary}
                  onChange={(e) => updateFilter("salary", e.target.value)}
                >
                  {SALARIES.map(sal => <option key={sal} value={sal}>{sal}</option>)}
                </select>
              </div>

              {/* AI Match */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Match
                </label>
                <select 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  value={filters.aiMatch}
                  onChange={(e) => updateFilter("aiMatch", e.target.value)}
                >
                  {AI_MATCHES.map(match => <option key={match} value={match}>{match}</option>)}
                </select>
              </div>

            </div>

            {/* Skills Multi-select */}
            <div className="space-y-2 pt-4 mt-2 border-t border-border/50">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" /> Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map(skill => {
                  const isSelected = filters.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        isSelected 
                          ? 'bg-primary text-primary-foreground border-primary' 
                          : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer: Sort, Reset, Count */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-border/50 gap-4 mt-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
                <select 
                  className="h-9 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none min-w-[160px]"
                  value={filters.sortBy}
                  onChange={(e) => updateFilter("sortBy", e.target.value)}
                >
                  {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-sm font-medium bg-secondary/50 px-3 py-1.5 rounded-lg border border-border">
                  Showing <strong className="text-primary">{totalJobsCount}</strong> matching jobs
                </span>
                <button 
                  onClick={onReset}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors px-2 py-1 rounded-md hover:bg-secondary"
                >
                  <FilterX className="w-4 h-4" /> Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-background/80 backdrop-blur-sm md:hidden">
          <div className="bg-card w-full h-[85vh] rounded-t-3xl border-t border-border shadow-2xl flex flex-col animate-in slide-in-from-bottom-full duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                Filters
              </h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              
              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Location</label>
                <select className="w-full h-12 px-3 rounded-xl border border-input bg-background text-base" value={filters.location} onChange={(e) => updateFilter("location", e.target.value)}>
                  {LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Experience</label>
                <select className="w-full h-12 px-3 rounded-xl border border-input bg-background text-base" value={filters.experience} onChange={(e) => updateFilter("experience", e.target.value)}>
                  {EXPERIENCES.map(exp => <option key={exp} value={exp}>{exp}</option>)}
                </select>
              </div>

              {/* AI Match */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">AI Match</label>
                <select className="w-full h-12 px-3 rounded-xl border border-input bg-background text-base" value={filters.aiMatch} onChange={(e) => updateFilter("aiMatch", e.target.value)}>
                  {AI_MATCHES.map(match => <option key={match} value={match}>{match}</option>)}
                </select>
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SKILLS.map(skill => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border ${
                        filters.skills.includes(skill) ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Sort By */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Sort By</label>
                <select className="w-full h-12 px-3 rounded-xl border border-input bg-background text-base" value={filters.sortBy} onChange={(e) => updateFilter("sortBy", e.target.value)}>
                  {SORT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

            </div>
            
            <div className="p-4 border-t border-border flex gap-4 bg-card">
              <Button variant="outline" size="lg" className="flex-1 rounded-xl font-bold" onClick={() => { onReset(); setIsMobileFiltersOpen(false); }}>
                Clear
              </Button>
              <Button variant="primary" size="lg" className="flex-1 rounded-xl font-bold" onClick={() => setIsMobileFiltersOpen(false)}>
                Apply ({totalJobsCount})
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
