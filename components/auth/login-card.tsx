import Link from "next/link";
import { Zap } from "lucide-react";
import { GithubIcon } from "@/components/icons/github-icon";
import { Button } from "@/components/ui/button";

export function LoginCard() {
  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-border shadow-2xl relative z-10">
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <Zap className="text-white w-7 h-7" />
        </div>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm">Log in to continue finding your perfect match.</p>
      </div>

      <div className="space-y-4">
        <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium">
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full h-12 rounded-xl text-base font-medium">
          <GithubIcon className="mr-2 w-5 h-5" />
          Continue with GitHub
        </Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>
        
        <div className="space-y-4">
           <input type="email" placeholder="Email address" className="w-full h-12 px-4 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
           <Button className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/20">
             Send Magic Link
           </Button>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-8">
        Don&apos;t have an account? <Link href="/register" className="text-primary font-medium hover:underline">Start your journey</Link>
      </p>
    </div>
  );
}
