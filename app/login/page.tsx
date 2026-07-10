import { LoginForm } from "@/components/auth";
import { Logo } from "@/components/shared";

export default function LoginPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center relative p-12 lg:p-24 bg-secondary/5 border-r border-border overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] -z-10" />
        
        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="mb-16">
            <Logo />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
              Welcome <br/> Back
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium">
              Sign in to discover your perfect career match. Swipe right on your dream job, and let our AI handle the rest.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden bg-background">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-8 lg:hidden z-20">
          <Logo />
        </div>
        
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
        
        <div className="w-full max-w-[420px] mx-auto relative z-10 mt-12 lg:mt-0">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
