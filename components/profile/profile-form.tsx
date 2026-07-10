"use client";

import * as React from "react";
import { Card, CardHeader, CardContent, Input } from "@/components/ui";
import { Button } from "@/components/shared";
import { User, Mail, MapPin, Briefcase, Award, Building, DollarSign, Globe, ChevronDown } from "lucide-react";

export function ProfileForm() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
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
            leftIcon={<User className="w-4 h-4 text-muted-foreground" />} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Email" 
              type="email" 
              placeholder="john@example.com" 
              leftIcon={<Mail className="w-4 h-4 text-muted-foreground" />} 
            />
            <Input 
              label="Location" 
              placeholder="San Francisco, CA" 
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
            leftIcon={<Briefcase className="w-4 h-4 text-muted-foreground" />} 
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Years of Experience" 
              type="number"
              placeholder="5" 
              leftIcon={<Award className="w-4 h-4 text-muted-foreground" />} 
            />
            <Input 
              label="Preferred Job Title" 
              placeholder="Senior Frontend Engineer" 
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
              leftIcon={<DollarSign className="w-4 h-4 text-muted-foreground" />} 
            />
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-sm font-medium leading-none">Work Style</label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors">
                  <Building className="w-4 h-4" />
                </div>
                <select className="flex h-10 w-full appearance-none rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer">
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
              leftIcon={<MapPin className="w-4 h-4 text-muted-foreground" />} 
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4 pb-12">
        <Button variant="outline" size="lg" className="w-full sm:w-auto font-bold shadow-sm">
          Save Profile
        </Button>
        <Button size="lg" className="w-full sm:w-auto font-bold shadow-lg shadow-primary/20">
          Continue
        </Button>
      </div>

    </div>
  );
}
