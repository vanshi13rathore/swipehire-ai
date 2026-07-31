"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dna, 
  Target, 
  BrainCircuit, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileCheck2,
  Star
} from "lucide-react";
import type { ResumeData } from "@/lib/supabase/types";

export function CareerDNADashboard({ resumeData }: { resumeData: ResumeData }) {
  const { ai_analysis, skills, experience } = resumeData;

  const atsScore = ai_analysis?.atsScore || 0;
  const strengths = ai_analysis?.strengths || [];
  const weaknesses = ai_analysis?.weaknesses || [];
  const extractedSkills = ai_analysis?.extractedSkills || skills || [];
  const suggestions = ai_analysis?.actionableSuggestions || [];
  const missingKeywords = ai_analysis?.missingSkills || ai_analysis?.keywordOptimization || [];
  const summary = ai_analysis?.summary || resumeData.summary || "No AI analysis available.";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100 }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <motion.div 
      className="max-w-6xl mx-auto space-y-8 p-4 md:p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="text-center space-y-4 mb-12">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-500/10 rounded-full mb-4">
          <Dna className="w-12 h-12 text-indigo-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Your Career DNA
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {summary}
        </p>
      </motion.div>

      {/* Core Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-indigo-500/20 shadow-lg shadow-indigo-500/5">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <Target className="w-8 h-8 text-indigo-400 mb-2" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">ATS Score</h3>
            <div className={`text-5xl font-black ${getScoreColor(atsScore)}`}>
              {atsScore}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Resume readability & formatting</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-blue-500/20 shadow-lg shadow-blue-500/5">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <BrainCircuit className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Top Skills</h3>
            <div className="text-4xl font-black text-foreground">
              {extractedSkills.length}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Recognized core competencies</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-purple-500/20 shadow-lg shadow-purple-500/5">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <Star className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Experience</h3>
            <div className="text-4xl font-black text-foreground">
              {experience?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Relevant roles extracted</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills Helix */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/40 backdrop-blur-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="w-5 h-5 text-indigo-400" />
              Core Competency Mapping
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {extractedSkills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Badge variant="secondary" className="px-3 py-1.5 text-sm bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors">
                    {skill}
                  </Badge>
                </motion.div>
              ))}
              {extractedSkills.length === 0 && (
                <p className="text-muted-foreground italic">No skills were extracted.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recruiter's Take: Strengths vs Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="h-full">
          <Card className="h-full bg-card/40 backdrop-blur-sm border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <TrendingUp className="w-5 h-5" />
                Key Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {strengths.map((strength, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{strength}</span>
                  </li>
                ))}
                {strengths.length === 0 && (
                  <p className="text-muted-foreground italic">No specific strengths identified.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="h-full bg-card/40 backdrop-blur-sm border-red-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <TrendingDown className="w-5 h-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {weaknesses.map((weakness, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground leading-relaxed">{weakness}</span>
                  </li>
                ))}
                {weaknesses.length === 0 && (
                  <p className="text-muted-foreground italic">No major weaknesses identified.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Missing Keywords & Actionable Advice */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Action Plan & Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {missingKeywords.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-orange-400" />
                  Missing Keywords (Add these to boost ATS Score)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((kw, idx) => (
                    <Badge key={idx} variant="outline" className="text-orange-300 border-orange-500/30 bg-orange-500/5">
                      + {kw}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400" />
                Actionable Next Steps
              </h4>
              <ul className="grid grid-cols-1 gap-3">
                {suggestions.map((suggestion, idx) => (
                  <li key={idx} className="bg-muted/50 p-4 rounded-lg border border-border/50 text-sm text-muted-foreground">
                    {suggestion}
                  </li>
                ))}
                {suggestions.length === 0 && (
                  <p className="text-muted-foreground italic">No actionable suggestions available.</p>
                )}
              </ul>
            </div>

          </CardContent>
        </Card>
      </motion.div>
      
    </motion.div>
  );
}
