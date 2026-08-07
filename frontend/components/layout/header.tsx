import Link from "next/link";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function Header() {
  return (
    <header className="px-6 h-20 flex items-center justify-between z-10 w-full max-w-6xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight">SwipeHire</span>
      </div>
      <nav className="hidden md:flex gap-6">
        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
        <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How it Works</Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-sm font-medium hidden sm:block">Log in</Link>
        <Link 
          href="/signup" 
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-9 px-4 py-2 rounded-full shadow-lg shadow-primary/25"
          )}
        >
          Get Started
        </Link>
      </div>
    </header>
  );
}
