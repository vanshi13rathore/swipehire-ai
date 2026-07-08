import { Button } from "@/components/shared";

export function CTA() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-primary/5 -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Ready to find your dream job?
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Join thousands of candidates who found their perfect match. Stop searching, start swiping.
        </p>
        <Button size="xl" className="font-semibold px-12 rounded-full shadow-lg shadow-primary/25">
          Start Free
        </Button>
      </div>
    </section>
  );
}
