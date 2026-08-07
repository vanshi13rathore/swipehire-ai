import * as React from "react";
import type { ResumeData } from "@/lib/supabase/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/shared";
import { ChevronDown, ChevronUp, Plus, Trash2, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { 
  improveSummary, 
  improveExperience, 
  improveProject, 
  improveSkills, 
  generateProfessionalSummary 
} from "@/lib/ai/resume-enhancer";
import { TailorResumeModal } from "./TailorResumeModal";
import { Target } from "lucide-react";

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

interface SectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, isOpen, onToggle, children }: Omit<SectionProps, 'id'>) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card mb-4 shadow-sm">
      <button 
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between bg-secondary/30 hover:bg-secondary/50 transition-colors"
      >
        <span className="font-bold text-base">{title}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-border/50 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

interface ItemControlsProps {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

function ItemControls({ index, total, onMoveUp, onMoveDown, onRemove }: ItemControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <button 
        onClick={onMoveUp}
        disabled={index === 0}
        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        title="Move Up"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button 
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        title="Move Down"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
      <button 
        onClick={onRemove}
        className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors ml-1"
        title="Remove"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Editor({ data, onChange }: EditorProps) {
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({
    header: true,
  });

  const [loadingStates, setLoadingStates] = React.useState<Record<string, boolean>>({});
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [isTailorModalOpen, setIsTailorModalOpen] = React.useState(false);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateField = (section: keyof ResumeData, field: string, value: string) => {
    if (section === "header") {
      onChange({
        ...data,
        header: { ...data.header, [field]: value }
      });
    } else {
      onChange({ ...data, [section]: value });
    }
  };

  const updateArrayItem = (section: keyof ResumeData, index: number, field: string, value: string) => {
    const newArray = [...(data[section] as Array<Record<string, unknown>>)];
    newArray[index] = { ...newArray[index], [field]: value };
    onChange({ ...data, [section]: newArray });
  };

  const updateStringArrayItem = (section: keyof ResumeData, index: number, value: string) => {
    const newArray = [...(data[section] as string[])];
    newArray[index] = value;
    onChange({ ...data, [section]: newArray });
  };

  const addArrayItem = (section: keyof ResumeData, defaultItem: Record<string, unknown>) => {
    onChange({
      ...data,
      [section]: [...(data[section] as Array<Record<string, unknown>> || []), { id: crypto.randomUUID(), ...defaultItem }]
    });
  };

  const addStringArrayItem = (section: keyof ResumeData) => {
    onChange({
      ...data,
      [section]: [...(data[section] as string[] || []), ""]
    });
  };

  const removeArrayItem = (section: keyof ResumeData, index: number) => {
    const newArray = [...(data[section] as Array<Record<string, unknown>>)];
    newArray.splice(index, 1);
    onChange({ ...data, [section]: newArray });
  };

  const moveItem = (section: keyof ResumeData, index: number, direction: 'up' | 'down') => {
    const newArray = [...(data[section] as Array<Record<string, unknown>>)];
    if (direction === 'up' && index > 0) {
      const temp = newArray[index - 1];
      newArray[index - 1] = newArray[index];
      newArray[index] = temp;
    } else if (direction === 'down' && index < newArray.length - 1) {
      const temp = newArray[index + 1];
      newArray[index + 1] = newArray[index];
      newArray[index] = temp;
    } else {
      return;
    }
    onChange({ ...data, [section]: newArray });
  };

  const handleAI = async (key: string, action: () => Promise<void>) => {
    try {
      setLoadingStates(prev => ({ ...prev, [key]: true }));
      setAiError(null);
      await action();
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : "AI Enhancement failed.");
      setTimeout(() => setAiError(null), 5000);
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleImproveSummary = () => {
    handleAI("summary", async () => {
      if (!data.summary || data.summary.trim() === "") {
        const res = await generateProfessionalSummary(data);
        updateField("summary", "summary", res.summary);
      } else {
        const res = await improveSummary(data.summary);
        updateField("summary", "summary", res.summary);
      }
    });
  };

  const handleImproveExperience = (index: number) => {
    handleAI(`exp-${index}`, async () => {
      const res = await improveExperience(data.experience[index]);
      updateArrayItem("experience", index, "description", res.description);
    });
  };

  const handleImproveProject = (index: number) => {
    handleAI(`proj-${index}`, async () => {
      const res = await improveProject(data.projects[index]);
      updateArrayItem("projects", index, "description", res.description);
    });
  };

  const handleImproveSkills = () => {
    handleAI("skills", async () => {
      const res = await improveSkills(data.skills);
      onChange({ ...data, skills: res.skills });
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2 relative">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border shadow-sm mb-4">
        <div>
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            AI Resume Tailoring
          </h3>
          <p className="text-sm text-muted-foreground">Optimize your resume for a specific job description</p>
        </div>
        <Button onClick={() => setIsTailorModalOpen(true)}>
          <Target className="w-4 h-4 mr-2" />
          Tailor Resume
        </Button>
      </div>

      <TailorResumeModal 
        isOpen={isTailorModalOpen} 
        onClose={() => setIsTailorModalOpen(false)} 
        data={data} 
        onApply={(tailoredData) => onChange(tailoredData)}
      />

      {aiError && (
        <div className="sticky top-0 z-50 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center shadow-sm">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
          <span className="flex-1">{aiError}</span>
          <button onClick={() => setAiError(null)} className="ml-2 hover:opacity-70">&times;</button>
        </div>
      )}

      <Section title="Personal Details" isOpen={openSections["header"]} onToggle={() => toggleSection("header")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <Input value={data.header?.name || ""} onChange={e => updateField("header", "name", e.target.value)} placeholder="Jane Doe" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email Address</label>
            <Input value={data.header?.email || ""} onChange={e => updateField("header", "email", e.target.value)} placeholder="jane@example.com" type="email" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phone Number</label>
            <Input value={data.header?.phone || ""} onChange={e => updateField("header", "phone", e.target.value)} placeholder="+1 (555) 000-0000" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Location</label>
            <Input value={data.header?.location || ""} onChange={e => updateField("header", "location", e.target.value)} placeholder="San Francisco, CA" />
          </div>
        </div>
      </Section>

      <Section title="Professional Summary" isOpen={openSections["summary"]} onToggle={() => toggleSection("summary")}>
        <div className="space-y-4">
          <textarea 
            className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={data.summary || ""}
            onChange={e => updateField("summary", "summary", e.target.value)}
            placeholder="A brief summary of your professional background and goals..."
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleImproveSummary} 
            disabled={loadingStates["summary"]}
            className="w-full sm:w-auto"
          >
            {loadingStates["summary"] ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
            )}
            {(!data.summary || data.summary.trim() === "") ? "Generate Summary" : "Improve with AI"}
          </Button>
        </div>
      </Section>

      <Section title="Work Experience" isOpen={openSections["experience"]} onToggle={() => toggleSection("experience")}>
        <div className="space-y-6">
          {(data.experience || []).map((exp, i) => (
            <div key={exp.id} className="p-4 rounded-xl border border-border/50 bg-secondary/5 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Job Title</label>
                    <Input value={exp.title || ""} onChange={e => updateArrayItem("experience", i, "title", e.target.value)} placeholder="Software Engineer" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Company</label>
                    <Input value={exp.company || ""} onChange={e => updateArrayItem("experience", i, "company", e.target.value)} placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                    <Input value={exp.startDate || ""} onChange={e => updateArrayItem("experience", i, "startDate", e.target.value)} placeholder="Jan 2020" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">End Date</label>
                    <Input value={exp.endDate || ""} onChange={e => updateArrayItem("experience", i, "endDate", e.target.value)} placeholder="Present" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <Input value={exp.location || ""} onChange={e => updateArrayItem("experience", i, "location", e.target.value)} placeholder="Remote" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleImproveExperience(i)} 
                        disabled={loadingStates[`exp-${i}`]}
                        className="h-7 text-xs px-2"
                      >
                        {loadingStates[`exp-${i}`] ? (
                          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 mr-1.5 text-primary" />
                        )}
                        Improve with AI
                      </Button>
                    </div>
                    <textarea 
                      className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={exp.description || ""} 
                      onChange={e => updateArrayItem("experience", i, "description", e.target.value)} 
                      placeholder="• Developed new features...&#10;• Improved performance by..."
                    />
                  </div>
                </div>
                <ItemControls 
                  index={i} 
                  total={data.experience.length} 
                  onMoveUp={() => moveItem("experience", i, 'up')}
                  onMoveDown={() => moveItem("experience", i, 'down')}
                  onRemove={() => removeArrayItem("experience", i)}
                />
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => addArrayItem("experience", { title: "", company: "", location: "", startDate: "", endDate: "", description: "" })}
            className="border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Experience
          </Button>
        </div>
      </Section>

      <Section title="Education" isOpen={openSections["education"]} onToggle={() => toggleSection("education")}>
        <div className="space-y-6">
          {(data.education || []).map((edu, i) => (
            <div key={edu.id} className="p-4 rounded-xl border border-border/50 bg-secondary/5 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Degree</label>
                    <Input value={edu.degree || ""} onChange={e => updateArrayItem("education", i, "degree", e.target.value)} placeholder="B.S. Computer Science" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">School</label>
                    <Input value={edu.school || ""} onChange={e => updateArrayItem("education", i, "school", e.target.value)} placeholder="University of Technology" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                    <Input value={edu.startDate || ""} onChange={e => updateArrayItem("education", i, "startDate", e.target.value)} placeholder="Aug 2016" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">End Date</label>
                    <Input value={edu.endDate || ""} onChange={e => updateArrayItem("education", i, "endDate", e.target.value)} placeholder="May 2020" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">Location</label>
                    <Input value={edu.location || ""} onChange={e => updateArrayItem("education", i, "location", e.target.value)} placeholder="New York, NY" />
                  </div>
                </div>
                <ItemControls 
                  index={i} 
                  total={data.education.length} 
                  onMoveUp={() => moveItem("education", i, 'up')}
                  onMoveDown={() => moveItem("education", i, 'down')}
                  onRemove={() => removeArrayItem("education", i)}
                />
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => addArrayItem("education", { degree: "", school: "", location: "", startDate: "", endDate: "" })}
            className="border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Education
          </Button>
        </div>
      </Section>

      <Section title="Skills" isOpen={openSections["skills"]} onToggle={() => toggleSection("skills")}>
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleImproveSkills} 
              disabled={loadingStates["skills"] || !data.skills || data.skills.length === 0}
            >
              {loadingStates["skills"] ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2 text-primary" />
              )}
              Categorize & Improve with AI
            </Button>
          </div>
          <div className="space-y-3">
            {(data.skills || []).map((skill, i) => (
              <div key={i} className="flex items-center gap-2">
              <Input value={skill} onChange={e => updateStringArrayItem("skills", i, e.target.value)} placeholder="React, TypeScript, Node.js..." className="flex-1" />
              <ItemControls 
                index={i} 
                total={data.skills.length} 
                onMoveUp={() => moveItem("skills", i, 'up')}
                onMoveDown={() => moveItem("skills", i, 'down')}
                onRemove={() => removeArrayItem("skills", i)}
              />
            </div>
          ))}
          <Button variant="outline" fullWidth onClick={() => addStringArrayItem("skills")} className="border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add Skill
          </Button>
        </div>
        </div>
      </Section>

      <Section title="Projects" isOpen={openSections["projects"]} onToggle={() => toggleSection("projects")}>
        <div className="space-y-6">
          {(data.projects || []).map((proj, i) => (
            <div key={proj.id} className="p-4 rounded-xl border border-border/50 bg-secondary/5 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="grid grid-cols-1 gap-4 flex-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Project Name</label>
                    <Input value={proj.name || ""} onChange={e => updateArrayItem("projects", i, "name", e.target.value)} placeholder="SwipeHire" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">URL (Optional)</label>
                    <Input value={proj.url || ""} onChange={e => updateArrayItem("projects", i, "url", e.target.value)} placeholder="https://github.com/..." />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-medium text-muted-foreground">Description</label>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleImproveProject(i)} 
                        disabled={loadingStates[`proj-${i}`]}
                        className="h-7 text-xs px-2"
                      >
                        {loadingStates[`proj-${i}`] ? (
                          <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3 mr-1.5 text-primary" />
                        )}
                        Improve with AI
                      </Button>
                    </div>
                    <textarea 
                      className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={proj.description || ""} 
                      onChange={e => updateArrayItem("projects", i, "description", e.target.value)} 
                      placeholder="Built a full-stack job application tracker..."
                    />
                  </div>
                </div>
                <ItemControls 
                  index={i} 
                  total={data.projects.length} 
                  onMoveUp={() => moveItem("projects", i, 'up')}
                  onMoveDown={() => moveItem("projects", i, 'down')}
                  onRemove={() => removeArrayItem("projects", i)}
                />
              </div>
            </div>
          ))}
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => addArrayItem("projects", { name: "", description: "", url: "" })}
            className="border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>
      </Section>

      <Section title="Achievements" isOpen={openSections["achievements"]} onToggle={() => toggleSection("achievements")}>
        <div className="space-y-3">
          {(data.achievements || []).map((ach, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={ach} onChange={e => updateStringArrayItem("achievements", i, e.target.value)} placeholder="Employee of the Month (2023)" className="flex-1" />
              <ItemControls 
                index={i} 
                total={data.achievements.length} 
                onMoveUp={() => moveItem("achievements", i, 'up')}
                onMoveDown={() => moveItem("achievements", i, 'down')}
                onRemove={() => removeArrayItem("achievements", i)}
              />
            </div>
          ))}
          <Button variant="outline" fullWidth onClick={() => addStringArrayItem("achievements")} className="border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add Achievement
          </Button>
        </div>
      </Section>

      <Section title="Certifications" isOpen={openSections["certifications"]} onToggle={() => toggleSection("certifications")}>
        <div className="space-y-3">
          {(data.certifications || []).map((cert, i) => (
            <div key={i} className="flex items-center gap-2">
              <Input value={cert} onChange={e => updateStringArrayItem("certifications", i, e.target.value)} placeholder="AWS Certified Solutions Architect" className="flex-1" />
              <ItemControls 
                index={i} 
                total={data.certifications.length} 
                onMoveUp={() => moveItem("certifications", i, 'up')}
                onMoveDown={() => moveItem("certifications", i, 'down')}
                onRemove={() => removeArrayItem("certifications", i)}
              />
            </div>
          ))}
          <Button variant="outline" fullWidth onClick={() => addStringArrayItem("certifications")} className="border-dashed">
            <Plus className="w-4 h-4 mr-2" /> Add Certification
          </Button>
        </div>
      </Section>

      <Section title="Links" isOpen={openSections["links"]} onToggle={() => toggleSection("links")}>
        <div className="space-y-6">
          {(data.links || []).map((link, i) => (
            <div key={link.id} className="flex items-center gap-4">
              <div className="grid grid-cols-2 gap-4 flex-1">
                <Input value={link.name || ""} onChange={e => updateArrayItem("links", i, "name", e.target.value)} placeholder="GitHub" />
                <Input value={link.url || ""} onChange={e => updateArrayItem("links", i, "url", e.target.value)} placeholder="https://github.com/jane" />
              </div>
              <ItemControls 
                index={i} 
                total={data.links.length} 
                onMoveUp={() => moveItem("links", i, 'up')}
                onMoveDown={() => moveItem("links", i, 'down')}
                onRemove={() => removeArrayItem("links", i)}
              />
            </div>
          ))}
          <Button 
            variant="outline" 
            fullWidth 
            onClick={() => addArrayItem("links", { name: "", url: "" })}
            className="border-dashed"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Link
          </Button>
        </div>
      </Section>
    </div>
  );
}
