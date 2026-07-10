"use client";

import * as React from "react";
import { Button } from "@/components/shared";
import { Card } from "@/components/ui";
import { MatchScore, CareerChemistry } from "@/components/ai";
import { MapPin, DollarSign, Briefcase, Clock, Building, Bookmark } from "lucide-react";
import { mockJobs } from "./mock-jobs";

export function JobDetails({ id }: { id: string }) {
  const job = mockJobs.find(j => j.id === id) || mockJobs[0];

  return (
    <div className="container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-24 h-24 rounded-2xl bg-secondary/10 border border-border flex items-center justify-center shrink-0 shadow-sm p-4">
              {job.company.logo ? (
                <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain rounded-lg" />
              ) : (
                <Building className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-3 flex-1">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground font-medium text-sm sm:text-base">
                <span className="text-foreground font-bold">{job.company.name}</span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className="hidden sm:inline text-border">•</span>
                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> {job.salary}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Clock className="w-3.5 h-3.5" /> {job.employmentType}
                </span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Briefcase className="w-3.5 h-3.5" /> {job.experienceLevel}
                </span>
              </div>
            </div>
          </div>

          <hr className="border-border/50" />

          <section className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">About the Role</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                We are looking for an exceptional {job.title} to join our team. 
                In this role, you will be responsible for building highly scalable, responsive, and beautifully 
                designed applications. You will collaborate closely with cross-functional teams including 
                design, product, and backend engineering to deliver world-class user experiences.
              </p>
              <p>
                As an integral member of our team, you will have the opportunity to architect new features 
                from scratch, optimize application performance, and mentor junior developers.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Key Responsibilities</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                "Architect and implement highly responsive user interface components.",
                "Collaborate with backend engineers to integrate scalable APIs.",
                "Optimize applications for maximum speed and scalability.",
                "Participate in code reviews to maintain high code quality and best practices.",
                "Translate Figma designs into high-quality, pixel-perfect code."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0 shadow-sm shadow-primary/50" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Requirements</h3>
            <ul className="space-y-3 text-muted-foreground">
              {[
                `Minimum of ${job.experienceLevel} in software development.`,
                "Deep understanding of modern JavaScript, TypeScript, and React ecosystems.",
                "Experience with state management libraries and RESTful/GraphQL APIs.",
                "Strong foundation in HTML5, CSS3, and responsive design principles.",
                "Excellent problem-solving skills and attention to detail."
              ].map((item, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="w-2 h-2 rounded-full bg-foreground mt-2 shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4 pt-2">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Required Skills</h3>
            <div className="flex flex-wrap gap-2.5">
              {job.skills.map((skill) => (
                <span key={skill} className="px-4 py-2 bg-secondary/30 border border-border/50 text-sm rounded-xl font-semibold shadow-sm text-foreground/80 hover:text-foreground transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="sticky top-8 space-y-6">
            <Card className="p-6 bg-card/60 backdrop-blur-md border-border/50 shadow-xl space-y-6 rounded-[2rem]">
              <div className="flex flex-col items-center justify-center pb-6 border-b border-border/50 gap-4">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Overall Match</span>
                <MatchScore score={job.matchPercentage || 95} className="w-32 h-32 border-[3px]" />
              </div>
              <div className="space-y-4">
                <Button size="xl" fullWidth className="font-bold text-base shadow-lg shadow-primary/20">
                  Apply Now
                </Button>
                <Button variant="outline" size="xl" fullWidth className="font-bold text-base shadow-sm" leftIcon={<Bookmark className="w-4 h-4" />}>
                  Save Job
                </Button>
              </div>
            </Card>

            <CareerChemistry />
          </div>
        </div>
        
      </div>
    </div>
  );
}
