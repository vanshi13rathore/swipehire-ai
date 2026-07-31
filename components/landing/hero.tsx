"use client";

import * as React from "react";
import { Button } from "@/components/shared";
import { Play, Sparkles, Zap, Target, Bot, CheckCircle2, FileText, XCircle } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";


const FEATURES = [
  { icon: Sparkles, text: "AI Career Chemistry" },
  { icon: Zap, text: "Instant Resume Analysis" },
  { icon: Target, text: "Smart Job Matching" },
  { icon: Bot, text: "AI Career Coach" },
];

const STATS = [
  { value: "10,000+", label: "Jobs" },
  { value: "95%", label: "Match Accuracy" },
  { value: "5,000+", label: "Candidates" },
  { value: "100+", label: "Companies" },
];

export function Hero() {
  const [isDemoOpen, setIsDemoOpen] = React.useState(false);
  const [demoStep, setDemoStep] = React.useState(0);

  // Demo Animation Sequence
  React.useEffect(() => {
    if (!isDemoOpen) {
      const resetTimer = setTimeout(() => setDemoStep(0), 0);
      return () => clearTimeout(resetTimer);
    }
    
    const timers = [
      setTimeout(() => setDemoStep(1), 1000), // Start analysis
      setTimeout(() => setDemoStep(2), 2500), // Show skills
      setTimeout(() => setDemoStep(3), 4000), // Show match score
    ];

    return () => timers.forEach(clearTimeout);
  }, [isDemoOpen]);

  return (
    <section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32 bg-background min-h-[90vh] flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[120px] opacity-50 mix-blend-screen animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 shadow-sm shadow-primary/20">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>SwipeHire 2.0 is now live</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.1]">
              <span className="block mb-2">Swipe Right.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-primary bg-[length:200%_auto] animate-gradient">Get Hired.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-[42rem] leading-relaxed">
              AI-powered career platform that reads your resume, understands your skills, and matches you with perfect opportunities.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              {FEATURES.map((feature, i) => (
                <div key={i} className="flex items-center text-sm font-medium text-foreground/80 bg-secondary/50 border border-border px-3 py-1.5 rounded-md backdrop-blur-sm">
                  <feature.icon className="w-4 h-4 mr-2 text-primary" />
                  {feature.text}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-12">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="xl" className="font-semibold w-full text-base h-14 px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                  Get Started
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="xl" 
                onClick={() => setIsDemoOpen(true)}
                leftIcon={<Play className="w-5 h-5 fill-current" />} 
                className="font-semibold w-full text-base h-14 px-8 bg-background/50 backdrop-blur-sm border-primary/30 hover:bg-primary/5"
              >
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full pt-8 border-t border-border/50">
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start">
                  <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Right Panel - Animated Mock UI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[500px] lg:max-w-none perspective-1000"
          >
            <div className="relative rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_0_60px_-15px_rgba(139,92,246,0.3)] overflow-hidden transform-gpu rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
              {/* Fake Browser Header */}
              <div className="h-10 border-b border-white/10 bg-white/[0.02] flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                <div className="ml-4 flex-1 h-6 rounded-md bg-black/40 border border-white/5 flex items-center justify-center shadow-inner">
                  <span className="text-[10px] text-white/40 font-mono tracking-wider">swipehire.com/dashboard</span>
                </div>
              </div>
              
              {/* Dashboard Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-semibold text-lg flex items-center gap-2 text-white/90">
                    <Sparkles className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" /> Career Chemistry
                  </h3>
                  <div className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                    Live Analysis
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Step 1: Resume */}
                  <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] shadow-sm flex items-center gap-4 hover:bg-white/[0.04] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-white/80">Resume_Software_Engineer.pdf</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                      </div>
                      <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-blue-500 to-primary"
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Step 2: Skills */}
                    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] shadow-sm hover:bg-white/[0.04] transition-colors flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4">Extracted Skills</span>
                      <div className="flex flex-wrap gap-2">
                        {["React", "Next.js", "TypeScript", "Node.js"].map((skill, i) => (
                          <motion.span 
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.2 + 0.5, repeat: Infinity, repeatDelay: 3 }}
                            className="text-[10px] px-2.5 py-1 rounded-md bg-white/5 text-white/70 border border-white/10 font-medium tracking-wide"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Step 3: Match */}
                    <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] shadow-sm hover:bg-white/[0.04] transition-colors flex flex-col items-center justify-center relative overflow-hidden">
                       <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest absolute top-5 left-5">AI Match</span>
                       <div className="relative w-24 h-24 mt-6 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                            <circle cx="48" cy="48" r="42" className="stroke-white/5" strokeWidth="4" fill="none" />
                            <motion.circle 
                              cx="48" cy="48" r="42" 
                              className="stroke-emerald-400" 
                              strokeWidth="4" 
                              fill="none" 
                              strokeLinecap="round"
                              strokeDasharray="264"
                              initial={{ strokeDashoffset: 264 }}
                              animate={{ strokeDashoffset: 21 }} // ~92%
                              transition={{ duration: 2, ease: "easeOut", repeat: Infinity, repeatDelay: 2 }}
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-black text-emerald-400 tracking-tighter">92%</span>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  {/* Step 4: Missing Skills */}
                  <div className="p-5 rounded-xl border border-white/5 bg-white/[0.02] shadow-sm hover:bg-white/[0.04] transition-colors">
                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-4">Missing for Senior Role</span>
                     <div className="flex flex-wrap gap-2">
                        {["Docker", "AWS", "Kubernetes"].map((skill, i) => (
                          <motion.span 
                            key={skill}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.2 + 1.5, repeat: Infinity, repeatDelay: 3 }}
                            className="text-[10px] px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium tracking-wide flex items-center gap-1.5 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
                          >
                            <XCircle className="w-3 h-3" /> {skill}
                          </motion.span>
                        ))}
                      </div>
                  </div>

                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Interactive Demo Modal (Option A) */}
      <AnimatePresence>
        {isDemoOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsDemoOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border/50 flex justify-between items-center bg-secondary/30">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Career Chemistry Demo
                </h2>
                <Button variant="ghost" size="sm" onClick={() => setIsDemoOpen(false)}>Close</Button>
              </div>
              
              <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                {demoStep === 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Analyzing Resume...</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Our AI is reading through your experience and extracting key technical skills.</p>
                    <div className="w-64 h-2 bg-secondary rounded-full mx-auto overflow-hidden">
                      <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1 }} />
                    </div>
                  </motion.div>
                )}

                {demoStep === 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                    <h3 className="text-2xl font-bold mb-6">Skills Extracted</h3>
                    <div className="flex flex-wrap justify-center gap-3 max-w-md mx-auto">
                      {["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL", "Tailwind"].map((s, i) => (
                        <motion.span 
                          key={s}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-lg font-medium"
                        >
                          {s}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}

                {demoStep >= 2 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                      <div className="relative w-40 h-40 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="80" cy="80" r="72" className="stroke-muted/30" strokeWidth="12" fill="none" />
                            <motion.circle 
                              cx="80" cy="80" r="72" 
                              className="stroke-green-500" 
                              strokeWidth="12" 
                              fill="none" 
                              strokeLinecap="round"
                              strokeDasharray="452"
                              initial={{ strokeDashoffset: 452 }}
                              animate={{ strokeDashoffset: 36 }} // ~92%
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-4xl font-black text-green-500">92%</span>
                            <span className="text-xs uppercase font-bold text-muted-foreground mt-1">Match</span>
                          </div>
                      </div>
                      
                      <div className="text-left space-y-4">
                        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                          <h4 className="font-bold text-green-500 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strong Fit</h4>
                          <p className="text-sm text-foreground/80 mt-1">Your React and TypeScript experience perfectly aligns with this role.</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                          <h4 className="font-bold text-red-500 flex items-center gap-2"><XCircle className="w-4 h-4" /> Skill Gap</h4>
                          <p className="text-sm text-foreground/80 mt-1">Missing <span className="font-mono bg-red-500/20 px-1 rounded">AWS</span>. Consider highlighting any cloud experience.</p>
                        </div>
                      </div>
                    </div>
                    <Button className="mt-8 px-8" size="lg" onClick={() => setIsDemoOpen(false)}>
                      Sign up to analyze your own resume
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
