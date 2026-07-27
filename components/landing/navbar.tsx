"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Logo } from "@/components/shared";
import { supabase } from "@/lib/supabase/client";

export function Navbar() {
  const router = useRouter();
  const [session, setSession] = React.useState<import('@supabase/supabase-js').Session | null>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8 max-w-7xl">
        <Logo />
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden md:inline-flex"
                onClick={() => router.push("/login")}
              >
                Log in
              </Button>
              <Button onClick={() => router.push("/signup")}>
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}