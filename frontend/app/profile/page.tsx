import { ProfileForm } from "@/components/profile";
import { Sparkles } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-12 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4 text-center pb-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-2 shadow-inner">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Complete Your Profile
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Let&apos;s set up your career DNA to find your perfect match.
          </p>
        </div>
        
        <ProfileForm />
      </div>
    </div>
  );
}
