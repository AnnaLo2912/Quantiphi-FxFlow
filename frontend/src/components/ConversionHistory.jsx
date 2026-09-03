import { useQuery } from "@tanstack/react-query";
import { History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getConversionHistory } from "@/services/api";
import CurrencyFlag from "@/components/CurrencyFlag";

export default function ConversionHistory({ showEmpty = false }) {
  const { data, isLoading } = useQuery({
    queryKey: ["conversionHistory"],
    queryFn: getConversionHistory,
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card">
        <CardContent className="p-5">
          <Skeleton className="h-5 w-32 mb-3" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const conversions = data?.conversions || [];

  if (conversions.length === 0) {
    if (!showEmpty) return null;
    return (
      <Card className="border-border/50 bg-card">
        <CardContent className="p-10 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-3">
            <History className="w-5 h-5 text-muted-foreground" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">No Conversions Yet</h3>
          <p className="text-xs text-muted-foreground">Your history appears after your first conversion.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-1.5 mb-4">
          <History className="w-3.5 h-3.5 text-green" />
          <h3 className="text-xs font-semibold text-foreground">Recent Conversions</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="text-[10px] font-medium uppercase tracking-wider h-8">From</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider h-8">To</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-right h-8">Rate</TableHead>
                <TableHead className="text-[10px] font-medium uppercase tracking-wider text-right h-8">Converted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversions.slice(0, 8).map((c) => (
                <TableRow key={c.id} className="hover:bg-secondary/20">
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <CurrencyFlag code={c.source_currency} size="sm" />
                      <span className="text-xs font-medium">{c.source_currency}</span>
                      <span className="text-[10px] text-muted-foreground">{formatAmount(c.amount)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1.5">
                      <CurrencyFlag code={c.target_currency} size="sm" />
                      <span className="text-xs font-medium">{c.target_currency}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right py-2.5 text-xs text-muted-foreground">
                    {c.exchange_rate.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right py-2.5 text-xs font-medium text-green">
                    {formatAmount(c.converted_amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function formatAmount(amount) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
