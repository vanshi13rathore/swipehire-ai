"use client";

import * as React from "react";
import { Card, CardHeader, CardContent, Input } from "@/components/ui";
import { Button } from "@/components/shared";
import { useRouter } from "next/navigation";
import { User, Mail, MapPin, Briefcase, Award, Building, DollarSign, Globe, ChevronDown, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function ProfileForm() {
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const [formData, setFormData] = React.useState({
    full_name: "",
    email: "",
    location: "",
    current_role: "",
    years_of_experience: "",
    preferred_job_title: "",
    skills: "",
    preferred_salary: "",
    work_style: "remote",
    preferred_location: ""
  });

  React.useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          setFormData({
            full_name: profile.full_name || "",
            email: profile.email || "",
            location: profile.location || "",
            current_role: profile.current_role || "",
            years_of_experience: profile.years_of_experience?.toString() || "",
            preferred_job_title: profile.preferred_job_title || "",
            skills: profile.skills ? profile.skills.join(", ") : "",
            preferred_salary: profile.preferred_salary || "",
            work_style: profile.work_style || "remote",
            preferred_location: profile.preferred_location || ""
          });
        } else {
          // Pre-fill from auth metadata if available
          setFormData(prev => ({
            ...prev,
            full_name: user.user_metadata?.full_name || "",
            email: user.email || ""
          }));
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, [router]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (isContinue = false) => {
    setIsSaving(true);
    setErrorMsg("");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to save your profile.");

      const payload = {
        id: user.id,
        full_name: formData.full_name,
        email: formData.email,
        location: formData.location,
        current_role: formData.current_role,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience, 10) : null,
        preferred_job_title: formData.preferred_job_title,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        preferred_salary: formData.preferred_salary,
        work_style: formData.work_style,
        preferred_location: formData.preferred_location,
        is_complete: true
      };

      const { error } = await supabase.from("profiles").upsert(payload);
      if (error) throw error;

      if (isContinue) {
        router.push("/resume");
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {errorMsg && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium">
          {errorMsg}
        </div>
      )}

      {/* 1. Personal Information */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4 pt-6 px-6">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> Personal Information
          </h2>
        </CardHeader>
        <CardContent className="space-y-5 pt-6 px-6 pb-8">
          <Input 
            label="Full Name" 
            placeholder="John Doe" 
            value={formData.full_name}
            onChange={(e) => handleChange("full_name", e.target.value)}
            leftIcon={<User className="w-4 h-4 text-muted-foreground" />} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Email" 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-muted-foreground" />} 
            />
            <Input 
              label="Location" 
              placeholder="San Francisco, CA" 
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              leftIcon={<MapPin className="w-4 h-4 text-muted-foreground" />} 
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Career */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4 pt-6 px-6">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-primary" /> Career
          </h2>
        </CardHeader>
        <CardContent className="space-y-5 pt-6 px-6 pb-8">
          <Input 
            label="Current Role" 
            placeholder="Frontend Engineer" 
            value={formData.current_role}
            onChange={(e) => handleChange("current_role", e.target.value)}
            leftIcon={<Briefcase className="w-4 h-4 text-muted-foreground" />} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Years of Experience" 
              type="number"
              placeholder="5" 
              value={formData.years_of_experience}
              onChange={(e) => handleChange("years_of_experience", e.target.value)}
              leftIcon={<Award className="w-4 h-4 text-muted-foreground" />} 
            />
            <Input 
              label="Preferred Job Title" 
              placeholder="Senior Frontend Engineer" 
              value={formData.preferred_job_title}
              onChange={(e) => handleChange("preferred_job_title", e.target.value)}
              leftIcon={<Briefcase className="w-4 h-4 text-muted-foreground" />} 
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Skills */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4 pt-6 px-6">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" /> Skills
          </h2>
        </CardHeader>
        <CardContent className="space-y-5 pt-6 px-6 pb-8">
          <Input 
            label="Skills" 
            placeholder="React, TypeScript, Tailwind CSS, Next.js (comma-separated)" 
            value={formData.skills}
            onChange={(e) => handleChange("skills", e.target.value)}
            leftIcon={<Award className="w-4 h-4 text-muted-foreground" />} 
          />
        </CardContent>
      </Card>

      {/* 4. Preferences */}
      <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg rounded-2xl">
        <CardHeader className="border-b border-border/50 pb-4 pt-6 px-6">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" /> Preferences
          </h2>
        </CardHeader>
        <CardContent className="space-y-5 pt-6 px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input 
              label="Preferred Salary" 
              placeholder="$120,000" 
              value={formData.preferred_salary}
              onChange={(e) => handleChange("preferred_salary", e.target.value)}
              leftIcon={<DollarSign className="w-4 h-4 text-muted-foreground" />} 
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium leading-none">Work Style</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                  <Building className="w-4 h-4" />
                </div>
                <select 
                  className="flex h-10 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer"
                  value={formData.work_style}
                  onChange={(e) => handleChange("work_style", e.target.value)}
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">Onsite</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
            <Input 
              label="Preferred Location" 
              placeholder="New York, NY" 
              value={formData.preferred_location}
              onChange={(e) => handleChange("preferred_location", e.target.value)}
              leftIcon={<MapPin className="w-4 h-4 text-muted-foreground" />} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 pb-12">
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full sm:w-auto font-bold shadow-sm"
          onClick={() => handleSave(false)}
          disabled={isSaving}
          loading={isSaving}
        >
          Save Profile
        </Button>
        <Button 
          onClick={() => handleSave(true)} 
          size="lg" 
          className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20"
          disabled={isSaving}
          loading={isSaving}
        >
          Continue
        </Button>
      </div>

    </div>
  );
}
