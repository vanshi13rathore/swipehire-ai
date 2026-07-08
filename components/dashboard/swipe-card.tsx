import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin, DollarSign } from "lucide-react";
import { Job } from "@/types";

interface SwipeCardProps {
  job: Job | null;
  onSwipe: () => void;
}

export function SwipeCard({ job, onSwipe }: SwipeCardProps) {
  return (
    <div className="relative w-full max-w-sm aspect-[3/4] perspective-[1000px]">
      <AnimatePresence>
        {job ? (
          <motion.div
            key={job.id}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
            drag="x"
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={1}
            onDragEnd={(e, info) => {
              if (info.offset.x > 100 || info.offset.x < -100) onSwipe();
            }}
            className="absolute inset-0 bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col cursor-grab active:cursor-grabbing"
          >
            {/* Image Placeholder */}
            <div className="h-1/2 bg-gradient-to-br from-primary/20 to-blue-500/10 flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-background shadow-lg flex items-center justify-center font-bold text-2xl border border-border">
                {job.company[0]}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-2xl font-extrabold tracking-tight">{job.title}</h2>
              <p className="text-muted-foreground font-medium mb-4">{job.company}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                  <MapPin className="w-3 h-3" /> {job.location}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground text-xs font-medium">
                  <DollarSign className="w-3 h-3" /> {job.salary}
                </span>
              </div>

              <div className="mt-auto">
                <p className="text-sm text-muted-foreground mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(s => (
                    <span key={s} className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-3xl">
            <Sparkles className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-xl font-bold mb-2">You&apos;re all caught up!</h3>
            <p className="text-muted-foreground text-sm">We&apos;re searching the web for more matches that fit your Career DNA.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
