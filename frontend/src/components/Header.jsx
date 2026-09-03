import { Activity, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">FxFlow</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" className="gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Live Rates
          </Badge>
        </div>
      </div>
    </header>
  );
}
