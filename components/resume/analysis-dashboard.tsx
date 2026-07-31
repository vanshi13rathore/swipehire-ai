"use client";

import * as React from "react";
import { motion, type Variants } from "framer-motion";
import { ResumeData } from "@/lib/supabase/types";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle, Zap, Target, Sparkles, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnalysisDashboard({ resumeData }: { resumeData: ResumeData }) {
  const analysis = resumeData.ai_analysis;

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Analysis Data Found</h2>
        <p className="text-muted-foreground">It looks like this resume hasn&apos;t been analyzed by AI yet.</p>
      </div>
    );
  }

  const {
    atsScore,
    extractedSkills,
    missingSkills,
    summary,
    strengths,
    weaknesses,
    actionableSuggestions,
    keywordOptimization
  } = analysis;

  const scoreColor = atsScore >= 80 ? "text-green-500" : atsScore >= 60 ? "text-yellow-500" : "text-red-500";
  const scoreRing = atsScore >= 80 ? "stroke-green-500" : atsScore >= 60 ? "stroke-yellow-500" : "stroke-red-500";
  const scoreBg = atsScore >= 80 ? "bg-green-500/10 border-green-500/20" : atsScore >= 60 ? "bg-yellow-500/10 border-yellow-500/20" : "bg-red-500/10 border-red-500/20";

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium text-sm">
          <Sparkles className="w-4 h-4" />
          AI Resume Analysis Complete
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Your Career DNA Revealed</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{summary}</p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Left Column: ATS Score & Action Plan */}
        <div className="space-y-8 lg:col-span-1">
          {/* ATS Score Card */}
          <motion.div variants={itemVariants}>
            <Card className={cn("border-border/50 backdrop-blur-md shadow-xl relative overflow-hidden", scoreBg)}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20" />
              <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" /> ATS Compatibility Score
                </h3>
                
                {/* Circular Progress */}
                <div className="relative w-48 h-48 mb-6">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle className="stroke-muted/20" strokeWidth="8" fill="transparent" r="42" cx="50" cy="50" />
                    <motion.circle
                      className={scoreRing}
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                      initial={{ strokeDasharray: "264", strokeDashoffset: "264" }}
                      animate={{ strokeDashoffset: 264 - (264 * atsScore) / 100 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 1 }}
                      className={cn("text-5xl font-black tabular-nums", scoreColor)}
                    >
                      {atsScore}
                    </motion.span>
                    <span className="text-sm font-medium text-muted-foreground mt-1">out of 100</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-foreground/80 px-4">
                  {atsScore >= 80 ? "Excellent! Your resume is highly optimized for Applicant Tracking Systems." 
                   : atsScore >= 60 ? "Good, but there's room for improvement to guarantee you pass filters." 
                   : "Needs work. You risk being auto-rejected by ATS software."}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actionable Suggestions */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Zap className="w-5 h-5" /> Action Plan
                </CardTitle>
                <CardDescription>Steps to improve your score</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {actionableSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-3 text-sm">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-foreground/90 leading-relaxed">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Skills & Strengths/Weaknesses */}
        <div className="space-y-8 lg:col-span-2">
          
          {/* Skills Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Found Skills */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <CheckCircle2 className="w-5 h-5" /> Skills Extracted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-medium border border-green-500/20">
                      {skill}
                    </span>
                  ))}
                  {extractedSkills.length === 0 && <span className="text-muted-foreground text-sm">No recognizable skills found.</span>}
                </div>
              </CardContent>
            </Card>

            {/* Missing Skills */}
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <XCircle className="w-5 h-5" /> Missing Core Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-500/20">
                      {skill}
                    </span>
                  ))}
                  {missingSkills.length === 0 && <span className="text-muted-foreground text-sm">No major missing skills identified!</span>}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strengths & Weaknesses */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" /> Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" /> Areas for Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weaknesses.map((wk, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <XCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                      <span>{wk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Keywords */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-blue-500" /> Recommended Keywords
                </CardTitle>
                <CardDescription>Adding these keywords can improve your searchability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {keywordOptimization.map(keyword => (
                    <span key={keyword} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-semibold border border-blue-500/20 shadow-sm">
                      + {keyword}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
