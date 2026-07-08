import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 text-center mt-20 mb-32 z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20"
      >
        <Sparkles className="w-4 h-4" />
        <span>The future of job searching is here</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.1]"
      >
        Swipe Right. <br className="hidden md:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">
          Get Hired.
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
      >
        Stop endless scrolling and applying into the void. Meet your AI Career Matchmaker that tells you exactly why you fit the job, and what you need to learn.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
      >
        <Button size="lg" className="h-14 px-8 rounded-full text-base font-semibold shadow-xl shadow-primary/20 group">
          Start Swiping
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
        <Button size="lg" variant="secondary" className="h-14 px-8 rounded-full text-base font-semibold">
          <Briefcase className="mr-2 w-5 h-5" />
          I&apos;m Hiring
        </Button>
      </motion.div>

      {/* Hero Image Mockup (Abstract representation) */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="mt-20 relative w-full max-w-3xl aspect-[16/9] md:aspect-[21/9] rounded-2xl border border-border bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-blue-500/5 pointer-events-none" />
        <div className="flex flex-col items-center justify-center text-muted-foreground/50">
           <div className="w-16 h-16 rounded-full bg-border flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 opacity-50" />
           </div>
           <p className="font-medium">AI Career Chemistry UI Preview</p>
        </div>
      </motion.div>
    </main>
  );
}
