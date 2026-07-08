import { Briefcase, User, Heart, Settings } from "lucide-react";
import { NavItem } from "./nav-item";

export function Sidebar() {
  return (
    <aside className="w-16 md:w-64 border-r border-border bg-card flex flex-col justify-between py-6">
      <div>
        <div className="px-4 md:px-6 mb-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Briefcase className="text-primary-foreground w-4 h-4" />
          </div>
          <span className="font-bold text-xl hidden md:block tracking-tight">SwipeHire</span>
        </div>
        <nav className="flex flex-col gap-2 px-2 md:px-4">
          <NavItem href="/dashboard" icon={<Briefcase />} label="Swipe Arena" active />
          <NavItem href="/matches" icon={<Heart />} label="Matches" />
          <NavItem href="/profile" icon={<User />} label="Career DNA" />
        </nav>
      </div>
      <div className="px-2 md:px-4">
        <NavItem href="/settings" icon={<Settings />} label="Settings" />
      </div>
    </aside>
  );
}
