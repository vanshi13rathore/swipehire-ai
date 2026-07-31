"use client";

import { motion } from "framer-motion";

const COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Adobe",
  "Meta",
  "Stripe",
];

export function SocialProof() {
  return (
    <section className="py-12 lg:py-20 border-t border-border/40 bg-secondary/20">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <p className="text-center text-sm font-semibold text-muted-foreground tracking-widest uppercase mb-8">
          Trusted by top companies & recruiters
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
          {COMPANIES.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300"
            >
              {/* Replace with actual SVG logos if available, using text as mockup */}
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-foreground/80">
                {company}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
