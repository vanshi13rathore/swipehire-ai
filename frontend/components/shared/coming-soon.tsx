"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/shared";
import { ArrowLeft, Construction } from "lucide-react";
import Link from "next/link";

interface ComingSoonProps {
  title: string;
  description: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-md w-full bg-card border border-border/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500" />
        
        <div className="w-20 h-20 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
          <Construction className="w-10 h-10 text-yellow-500" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-2">🚧 Coming Soon</h1>
        <h2 className="text-xl font-semibold text-primary mb-4">{title}</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {description}
          <br /><br />
          We&apos;re actively building this feature. See what&apos;s planned!
        </p>

        <Link href="/" className="inline-block w-full">
          <Button size="lg" className="w-full font-semibold group" variant="primary">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
