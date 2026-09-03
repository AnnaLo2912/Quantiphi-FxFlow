import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getConversionHistory } from "@/services/api";
import { formatNumber } from "@/lib/utils";

export default function ConversionHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["conversionHistory"],
    queryFn: getConversionHistory,
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const conversions = data?.conversions || [];

  if (conversions.length === 0) return null;

  return (
    <Card className="border-border/50 bg-card/80">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-muted-foreground">Recent Conversions</h3>
        </div>
        <div className="space-y-2">
          {conversions.slice(0, 5).map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">{c.source_currency}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
                <span className="font-medium">{c.target_currency}</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  {formatNumber(c.amount)}
                </span>
                <span className="font-medium text-foreground">
                  {formatNumber(c.converted_amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
