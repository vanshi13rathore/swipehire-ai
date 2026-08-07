"use client";

import React from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface Step {
  timeframe: string;
  action: string;
}

export function CareerRoadmap({ steps }: { steps: Step[] }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="relative pt-4">
      {/* Connecting Line */}
      <div className="absolute top-1/2 left-0 w-full h-1 bg-secondary -translate-y-1/2 z-0 hidden md:block rounded-full" />
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-row md:flex-col items-center gap-4">
            
            {/* Desktop Connector Icon */}
            <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-background border-2 border-primary text-primary shrink-0 z-10 shadow-sm">
              <CheckCircle2 className="w-4 h-4" />
            </div>

            {/* Mobile Connector */}
            <div className="flex md:hidden flex-col items-center gap-1 shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className="w-0.5 h-full bg-secondary" />
              )}
            </div>

            <div className="flex-1 md:text-center space-y-1.5 p-4 bg-background border border-border/50 rounded-2xl shadow-sm w-full transition-transform hover:-translate-y-1 hover:shadow-md hover:border-primary/30">
              <span className="text-xs font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                {step.timeframe}
              </span>
              <p className="text-sm font-semibold leading-snug">
                {step.action}
              </p>
            </div>
            
            {/* Mobile Arrow */}
            {index < steps.length - 1 && (
              <div className="hidden">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
