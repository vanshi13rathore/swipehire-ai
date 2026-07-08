import { Button } from "@/components/shared";
import { Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-foreground">
              <span className="block">Swipe Right.</span>
              <span className="block text-primary">Get Hired.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-[42rem] leading-relaxed">
              AI-powered career matching platform that helps candidates discover the perfect opportunities through intelligent job matching.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button size="xl" className="font-semibold w-full sm:w-auto">Get Started</Button>
              <Button variant="outline" size="xl" leftIcon={<Play className="w-5 h-5 fill-current" />} className="font-semibold w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none">
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-primary/20 via-card to-background border border-border/50 shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-primary/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary" />
                </div>
              </div>
              <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-md px-4 py-2 rounded-lg border border-border shadow-lg">
                <p className="text-sm font-semibold text-foreground">Match Found! 🎉</p>
              </div>
            </div>
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -z-10" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
