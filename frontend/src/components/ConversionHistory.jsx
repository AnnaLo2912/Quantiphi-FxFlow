import { useQuery } from "@tanstack/react-query";
import { Clock, ArrowRight, History } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getConversionHistory } from "@/services/api";
import CurrencyFlag from "@/components/CurrencyFlag";

export default function ConversionHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["conversionHistory"],
    queryFn: getConversionHistory,
    staleTime: 10000,
  });

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/90">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const conversions = data?.conversions || [];

  if (conversions.length === 0) return null;

  return (
    <Card className="border-border/50 bg-card/90">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <History className="w-4 h-4 text-cyan" />
          <h3 className="text-sm font-semibold text-foreground">Recent Conversions</h3>
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/30">
                <TableHead className="text-xs font-medium uppercase tracking-wider">Sell</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider">Buy</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-right">Rate</TableHead>
                <TableHead className="text-xs font-medium uppercase tracking-wider text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversions.slice(0, 5).map((c) => (
                <TableRow key={c.id} className="hover:bg-secondary/20">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CurrencyFlag code={c.source_currency} size="sm" />
                      <span className="font-medium text-sm">{c.source_currency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CurrencyFlag code={c.target_currency} size="sm" />
                      <span className="font-medium text-sm">{c.target_currency}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {c.exchange_rate.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right text-sm font-medium text-cyan">
                    {formatAmount(c.converted_amount, c.target_currency)}
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

function formatAmount(amount, currency) {
  const symbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥" };
  const sym = symbols[currency] || "";
  return sym + new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
}
