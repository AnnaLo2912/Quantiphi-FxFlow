import { Home, ArrowLeftRight, TrendingUp, Star, Clock, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "convert", icon: ArrowLeftRight, label: "Convert" },
  { id: "rates", icon: TrendingUp, label: "Rates" },
  { id: "favorites", icon: Star, label: "Favorites" },
  { id: "history", icon: Clock, label: "History" },
  { id: "travel", icon: Plane, label: "Travel Budget" },
];

export default function Sidebar({ activeSection, onNavigate }) {
  return (
    <aside className="hidden lg:flex flex-col w-56 border-r border-border bg-card/50 backdrop-blur-sm">
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeSection === item.id
                ? "bg-green/10 text-green"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
