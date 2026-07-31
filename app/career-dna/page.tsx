import { ComingSoon } from "@/components/shared/coming-soon";
import { Navbar, Footer } from "@/components/landing";

export default function CareerDNAPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-24">
        <ComingSoon 
          title="Career DNA"
          description="We are preparing the tools to map your unique skills and traits into a comprehensive profile that stands out to recruiters."
        />
      </main>
      <Footer />
    </div>
  );
}
