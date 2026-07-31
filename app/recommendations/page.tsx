import { ComingSoon } from "@/components/shared/coming-soon";
import { Navbar, Footer } from "@/components/landing";

export default function RecommendationsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-24">
        <ComingSoon 
          title="Smart Recommendations"
          description="Our machine learning algorithms are training to get smarter with every swipe, finding jobs you didn't even know existed."
        />
      </main>
      <Footer />
    </div>
  );
}
