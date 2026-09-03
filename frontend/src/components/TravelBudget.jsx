import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plane, Loader2, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTravelBudget } from "@/services/api";
import CurrencyFlag from "@/components/CurrencyFlag";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CHF", "CAD", "AUD", "CNY", "BRL"];

export default function TravelBudget() {
  const [enabled, setEnabled] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState("5000");
  const [result, setResult] = useState(null);

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
    <Card className="border-border/50 bg-card/90">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan/10 flex items-center justify-center">
              <Plane className="w-4 h-4 text-cyan" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Travel Budget</h3>
              <p className="text-xs text-muted-foreground">Compare your budget across currencies</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{enabled ? "ON" : "OFF"}</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>

        {enabled && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-cyan uppercase tracking-wider">Base Currency</label>
                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                  <SelectTrigger className="h-11 bg-[#1a2540]">
                    <div className="flex items-center gap-2">
                      <CurrencyFlag code={baseCurrency} size="sm" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-[#162032] border-border/50 shadow-xl shadow-black/50">
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        <div className="flex items-center gap-2">
                          <CurrencyFlag code={c} size="sm" />
                          {c}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-cyan uppercase tracking-wider">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Budget amount"
                  min="0"
                  className="h-11 bg-[#1a2540]"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleCalculate} disabled={mutation.isPending} className="h-11 bg-cyan hover:bg-cyan/90 text-primary-foreground">
                  {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Globe className="w-4 h-4 mr-2" />}
                  {mutation.isPending ? "Calculating..." : "Compare"}
                </Button>
              </div>
            </div>

            {mutation.isError && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{mutation.error.message}</p>
              </div>
            )}

            {mutation.isPending && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            )}

            {result && (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/30">
                      <TableHead className="text-xs font-medium uppercase tracking-wider">Currency</TableHead>
                      <TableHead className="text-xs font-medium uppercase tracking-wider text-right">Equivalent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-secondary/10">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CurrencyFlag code={result.base_currency} size="sm" />
                          <span className="font-medium">{result.base_currency}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-cyan">
                        {new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(result.amount)}
                      </TableCell>
                    </TableRow>
                    {result.conversions
                      .filter((c) => c.currency !== result.base_currency)
                      .map((c) => (
                        <TableRow key={c.currency} className="hover:bg-secondary/20">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CurrencyFlag code={c.currency} size="sm" />
                              <span className="font-medium">{c.currency}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
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
