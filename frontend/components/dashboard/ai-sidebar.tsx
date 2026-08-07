import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Job } from "@/types";

interface AISidebarProps {
  currentJob: Job | null;
}

export function AISidebar({ currentJob }: AISidebarProps) {
  return (
    <div className="hidden lg:flex w-80 border-l border-border bg-card/50 flex-col p-6 overflow-y-auto">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg">AI Career Chemistry™</h3>
      </div>
      
      {currentJob ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-background border border-border flex items-center justify-between">
             <div>
                <p className="text-sm font-medium text-muted-foreground">Match Score</p>
                <p className="text-3xl font-extrabold text-green-500">{currentJob.match}%</p>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-green-500/20 border-t-green-500 animate-[spin_3s_linear_infinite]" />
          </div>

          <div>
             <h4 className="text-sm font-semibold mb-3">Matched Skills</h4>
             <ul className="space-y-2">
               {currentJob.skills.map(s => (
                 <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {s}
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="text-sm font-semibold mb-3">Missing Skills</h4>
             <ul className="space-y-3">
               {currentJob.missing.map(s => (
                 <li key={s} className="p-3 rounded-lg border border-border bg-background">
                   <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{s}</span>
                      <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">~12 hrs</span>
                   </div>
                   <p className="text-xs text-muted-foreground">Often required for this specific role.</p>
                 </li>
               ))}
             </ul>
          </div>
          
          <Button className="w-full mt-4" variant="secondary">Generate Learning Path</Button>
        </div>
      ) : (
        <div className="text-center text-muted-foreground text-sm mt-10">
          Swipe on jobs to see your chemistry score.
        </div>
      )}
    </div>
  );
}
