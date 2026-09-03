import { cn } from "@/lib/utils";

export default function SpotlightCard({ children, className }) {
  return (
    <div className={cn("relative group", className)}>
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-green/20 via-green/5 to-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="relative">{children}</div>
    </div>
  );
}
