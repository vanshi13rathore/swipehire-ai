"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Logo } from "@/components/shared";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "How it Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
];

export function Navbar() {
  const router = useRouter();
  const [session, setSession] = React.useState<import('@supabase/supabase-js').Session | null>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300",
      isScrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm supports-[backdrop-filter]:bg-background/60" 
        : "bg-transparent border-transparent"
    )}>
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex items-center gap-8">
          <Logo />
          
          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex font-semibold"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="outline" className="font-semibold">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden sm:inline-flex font-semibold"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
              <Button onClick={() => router.push("/signup")} className="font-semibold px-6">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}