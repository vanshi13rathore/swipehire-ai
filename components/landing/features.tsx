"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Sparkles, Layers, Fingerprint, FileText, Target, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const features = [
  {
    title: "AI Career Chemistry™",
    description: "Our proprietary AI analyzes deep compatibility between your personality and company culture.",
    icon: Sparkles,
    href: "/career-chemistry",
    color: "from-purple-500/20 to-primary/20",
    iconColor: "text-purple-400"
  },
  {
    title: "Swipe Jobs",
    description: "Tinder-like intuitive interface to quickly sort through opportunities. Swipe right to apply.",
    icon: Layers,
    href: "/jobs",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400"
  },
  {
    title: "Career DNA",
    description: "We map your unique skills and traits into a comprehensive profile that stands out to recruiters.",
    icon: Fingerprint,
    href: "/career-dna",
    color: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400"
  },
  {
    title: "Resume Analyzer",
    description: "Instantly parse and optimize your resume to highlight exactly what hiring managers want to see.",
    icon: FileText,
    href: "/resume",
    color: "from-orange-500/20 to-amber-500/20",
    iconColor: "text-orange-400"
  },
  {
    title: "Smart Recommendations",
    description: "Machine learning algorithms that get smarter with every swipe, finding jobs you didn't even know existed.",
    icon: Target,
    href: "/recommendations",
    color: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400"
  }
];

export function Features() {
  return (
    <section className="py-24 bg-background relative overflow-hidden" id="features">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">The Future of Hiring</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Everything you need to land your dream job, packed into one seamless interactive experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link 
                  href={feature.href}
                  className="block h-full group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                  aria-label={`Navigate to ${feature.title}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="h-full"
                  >
                    <Card 
                      variant="glass" 
                      className="h-full relative overflow-hidden border-border/50 bg-secondary/10 group-hover:bg-secondary/20 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] group-hover:border-transparent"
                    >
                      {/* Gradient Border Overlay on Hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none p-[1px]`}>
                        <div className="absolute inset-[1px] bg-card/90 backdrop-blur-sm rounded-xl" />
                      </div>
                      
                      <CardHeader className="relative z-10">
                        <div className="w-14 h-14 rounded-xl bg-secondary/50 flex items-center justify-center mb-6 border border-border/50 group-hover:scale-110 transition-transform duration-300">
                          <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                        </div>
                        <CardTitle className="text-2xl font-bold flex items-center justify-between group-hover:text-primary transition-colors">
                          {feature.title}
                          <ArrowRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <CardDescription className="text-base leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
