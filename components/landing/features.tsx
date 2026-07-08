import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { Sparkles, Layers, Fingerprint, FileText, Target } from "lucide-react";

const features = [
  {
    title: "AI Career Chemistry™",
    description: "Our proprietary AI analyzes deep compatibility between your personality and company culture.",
    icon: Sparkles
  },
  {
    title: "Swipe Jobs",
    description: "Tinder-like intuitive interface to quickly sort through opportunities. Swipe right to apply.",
    icon: Layers
  },
  {
    title: "Career DNA",
    description: "We map your unique skills and traits into a comprehensive profile that stands out to recruiters.",
    icon: Fingerprint
  },
  {
    title: "Resume Analyzer",
    description: "Instantly parse and optimize your resume to highlight exactly what hiring managers want to see.",
    icon: FileText
  },
  {
    title: "Smart Recommendations",
    description: "Machine learning algorithms that get smarter with every swipe, finding jobs you didn't even know existed.",
    icon: Target
  }
];

export function Features() {
  return (
    <section className="py-24 bg-surface/30">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">The Future of Hiring</h2>
          <p className="text-lg text-muted-foreground">Everything you need to land your dream job, packed into one seamless experience.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} variant="glass" className="border-border/50 hover:border-primary/50 transition-colors h-full">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
