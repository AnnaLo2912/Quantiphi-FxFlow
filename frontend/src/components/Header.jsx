import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green/10 flex items-center justify-center">
            <ArrowLeftRight className="w-4 h-4 text-green" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">FxFlow</h1>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="green" className="gap-1.5 px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Live Rates
          </Badge>
        </div>
      </div>
    </header>
  );
}
