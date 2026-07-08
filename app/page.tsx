import { Navbar, Hero, Features, CTA, Footer } from "@/components/landing";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
