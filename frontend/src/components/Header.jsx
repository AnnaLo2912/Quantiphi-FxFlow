import { ArrowLeftRight, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-4 h-12 flex items-center justify-between">
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
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Moon className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
