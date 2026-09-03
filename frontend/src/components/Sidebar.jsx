import { Home, ArrowLeftRight, TrendingUp, Star, Clock, Plane, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: ArrowLeftRight, label: "Exchange", active: false },
  { icon: TrendingUp, label: "Rates", active: false },
  { icon: Star, label: "Favorites", active: false },
  { icon: Clock, label: "History", active: false },
  { icon: Plane, label: "Travel", active: false },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Support" },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card/50 backdrop-blur-sm">
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              item.active
                ? "bg-cyan/10 text-cyan"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
