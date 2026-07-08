import { LoginCard } from "@/components/auth/login-card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] -z-10" />
      
      <LoginCard />
    </div>
  );
}
