import { Zap } from "lucide-react";
import Link from "next/link";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
        <Zap className="text-white w-5 h-5" />
      </div>
      <span className="font-bold text-xl tracking-tight">SwipeHire</span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
