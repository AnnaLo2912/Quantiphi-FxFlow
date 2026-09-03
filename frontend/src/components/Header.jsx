import { Activity, Bell, Settings, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-cyan" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">FxFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="cyan" className="gap-1.5 px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Rates
          </Badge>
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="w-9 h-9 rounded-full bg-cyan/20 flex items-center justify-center hover:bg-cyan/30 transition-colors">
            <User className="w-4 h-4 text-cyan" />
          </button>
        </div>
      </div>
    </header>
  );
}
