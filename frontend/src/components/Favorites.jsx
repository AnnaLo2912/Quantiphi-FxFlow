import { useQuery } from "@tanstack/react-query";
import { X, Star, ArrowRight, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites, useDeleteFavorite } from "@/hooks/useFavorites";
import CurrencyFlag from "@/components/CurrencyFlag";

export default function Favorites({ onSelect, showEmpty = false }) {
  const { data: favorites, isLoading } = useFavorites();
  const deleteFavorite = useDeleteFavorite();

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card h-full">
        <CardContent className="p-5">
          <Skeleton className="h-5 w-24 mb-3" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!favorites || favorites.length === 0) {
    if (!showEmpty) return (
      <Card className="border-border/50 bg-card h-full">
        <CardContent className="p-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Star className="w-3.5 h-3.5 text-green" />
            <h3 className="text-xs font-semibold text-foreground">Favorites</h3>
          </div>
          <p className="text-xs text-muted-foreground">Save pairs from the converter.</p>
        </CardContent>
      </Card>
    );
    return (
      <Card className="border-border/50 bg-card h-full">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
            <Star className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">No Favorites Yet</h3>
          <p className="text-xs text-muted-foreground">Save pairs from the converter.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card h-full">
      <CardContent className="p-5">
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-3.5 h-3.5 text-green" />
          <h3 className="text-xs font-semibold text-foreground">Favorites</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {favorites.map((fav) => (
            <button
              key={fav.id}
              className="group flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 bg-secondary/50 hover:bg-secondary hover:border-green/30 transition-all cursor-pointer"
              onClick={() => onSelect(fav.source_currency, fav.target_currency)}
            >
              <CurrencyFlag code={fav.source_currency} size="sm" />
              <span className="text-xs font-medium">{fav.source_currency}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <CurrencyFlag code={fav.target_currency} size="sm" />
              <span className="text-xs font-medium">{fav.target_currency}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFavorite.mutate(fav.id);
                }}
                className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
