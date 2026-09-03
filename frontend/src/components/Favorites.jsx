import { useQuery } from "@tanstack/react-query";
import { X, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites, useDeleteFavorite } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";

export default function Favorites({ onSelect }) {
  const { data: favorites, isLoading } = useFavorites();
  const deleteFavorite = useDeleteFavorite();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Favorites</h3>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
        <Star className="w-3.5 h-3.5" />
        Favorites
      </h3>
      <div className="flex flex-wrap gap-2">
        {favorites.map((fav) => (
          <div
            key={fav.id}
            className={cn(
              "group flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border/50",
              "bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer text-sm"
            )}
            onClick={() => onSelect(fav.source_currency, fav.target_currency)}
          >
            <span className="font-medium">{fav.source_currency}</span>
            <ArrowRight className="w-3 h-3 text-muted-foreground" />
            <span className="font-medium">{fav.target_currency}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteFavorite.mutate(fav.id);
              }}
              className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
