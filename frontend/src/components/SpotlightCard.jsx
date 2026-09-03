import { cn } from "@/lib/utils";

export default function SpotlightCard({ children, className }) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative">{children}</div>
    </div>
  );
}
