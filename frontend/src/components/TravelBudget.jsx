import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plane, Loader2, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTravelBudget, getCurrencies } from "@/services/api";
import CurrencySelect from "@/components/CurrencySelect";

const FALLBACK_CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CHF", "CAD", "AUD", "CNY", "BRL"];
const FLAGS = { USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳", JPY: "🇯🇵", CHF: "🇨🇭", CAD: "🇨🇦", AUD: "🇦🇺", CNY: "🇨🇳", BRL: "🇧🇷" };

export default function TravelBudget({ forceOpen = false }) {
  const [enabled, setEnabled] = useState(forceOpen);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState("5000");
  const [result, setResult] = useState(null);

  const showContent = forceOpen || enabled;

  const { data: currencyData } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    staleTime: 3600000,
  });

  const currencies = currencyData?.currencies || FALLBACK_CURRENCIES.map((c) => ({ code: c, name: c }));

  const mutation = useMutation({
    mutationFn: ({ baseCurrency, amount }) => calculateTravelBudget(baseCurrency, parseFloat(amount)),
    onSuccess: (data) => setResult(data),
  });

  const handleCalculate = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    mutation.mutate({ baseCurrency, amount: num });
  };

  return (
    <Card className="border-border bg-card h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-green/10 flex items-center justify-center">
              <Plane className="w-3 h-3 text-green" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-foreground">Travel Budget</h3>
            </div>
          </div>
          {!forceOpen && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">{enabled ? "ON" : "OFF"}</span>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          )}
        </div>

        {showContent && (
          <div className="space-y-3">
            <div className="grid grid-cols-[1fr,1fr,auto] gap-2">
              <CurrencySelect value={baseCurrency} onValueChange={setBaseCurrency} currencies={currencies} />
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                min="0"
                className="h-10 text-sm bg-background"
              />
              <Button onClick={handleCalculate} disabled={mutation.isPending} className="h-10 bg-green hover:bg-green/90 text-primary-foreground text-xs px-3">
                {mutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              </Button>
            </div>

            {mutation.isError && (
              <div className="p-2 rounded bg-destructive/10 border border-destructive/20">
                <p className="text-[11px] text-destructive">{mutation.error.message}</p>
              </div>
            )}

            {mutation.isPending && (
              <div className="space-y-1.5">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-9 w-full" />)}
              </div>
            )}

            {result && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/30">
                      <TableHead className="text-[10px] font-medium uppercase tracking-wider h-8">Currency</TableHead>
                      <TableHead className="text-[10px] font-medium uppercase tracking-wider text-right h-8">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.conversions.map((c) => (
                      <TableRow key={c.currency} className="hover:bg-secondary/20">
                        <TableCell className="py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-base">{FLAGS[c.currency] || "🏳️"}</span>
                            <span className="text-xs font-medium">{c.currency}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-2 text-xs font-medium">
                          {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(c.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
