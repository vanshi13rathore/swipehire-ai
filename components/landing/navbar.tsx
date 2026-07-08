import { Button, Logo } from "@/components/shared";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-8 max-w-7xl">
        <Logo />
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:inline-flex">
            Log in
          </Button>
          <Button>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
