import { X, Star, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites, useDeleteFavorite } from "@/hooks/useFavorites";

const FLAGS = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳", JPY: "🇯🇵", CHF: "🇨🇭",
  CAD: "🇨🇦", AUD: "🇦🇺", CNY: "🇨🇳", BRL: "🇧🇷", KRW: "🇰🇷", MXN: "🇲🇽",
  SGD: "🇸🇬", HKD: "🇭🇰", THB: "🇹🇭", IDR: "🇮🇩", MYR: "🇲🇾", PHP: "🇵🇭",
  VND: "🇻🇳", NGN: "🇳🇬", EGP: "🇪🇬", PKR: "🇵🇰", BDT: "🇧🇩", LKR: "🇱🇰",
};

export default function Favorites({ onSelect }) {
  const { data: favorites, isLoading } = useFavorites();
  const deleteFavorite = useDeleteFavorite();

  if (isLoading) {
    return (
      <Card className="border-border bg-card h-full">
        <CardContent className="p-3">
          <Skeleton className="h-4 w-20 mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-7 w-24 rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <Card className="border-border bg-card h-full">
        <CardContent className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Star className="w-3 h-3 text-green" />
            <h3 className="text-xs font-semibold text-foreground">Favorites</h3>
          </div>
          <p className="text-[11px] text-muted-foreground">Save pairs from the converter.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card h-full">
      <CardContent className="p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Star className="w-3 h-3 text-green" />
          <h3 className="text-xs font-semibold text-foreground">Favorites</h3>
          <span className="text-[10px] text-muted-foreground">({favorites.length})</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto">
          {favorites.map((fav) => (
            <button
              key={fav.id}
              className="group flex items-center gap-1 px-2 py-1 rounded-md border border-border bg-secondary/50 hover:bg-secondary hover:border-green/30 transition-all cursor-pointer"
              onClick={() => onSelect(fav.source_currency, fav.target_currency)}
            >
              <span className="text-xs">{FLAGS[fav.source_currency] || "🏳️"}</span>
              <span className="text-[11px] font-medium">{fav.source_currency}</span>
              <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-xs">{FLAGS[fav.target_currency] || "🏳️"}</span>
              <span className="text-[11px] font-medium">{fav.target_currency}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteFavorite.mutate(fav.id);
                }}
                className="ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
