import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Plane, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTravelBudget } from "@/services/api";
import { formatNumber } from "@/lib/utils";

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "JPY", "CHF", "CAD", "AUD", "CNY", "BRL"];

export default function TravelBudget() {
  const [enabled, setEnabled] = useState(false);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [amount, setAmount] = useState("2000");
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
    <Card className="border-border/50 bg-card/80">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Plane className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Travel Budget</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{enabled ? "ON" : "OFF"}</span>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>
        </div>

        {enabled && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Compare your budget across major currencies</p>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr,1fr,auto] gap-3">
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Base Currency</label>
                <Select value={baseCurrency} onValueChange={setBaseCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground font-medium">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Budget amount"
                  min="0"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={handleCalculate} disabled={mutation.isPending} className="w-full sm:w-auto">
                  {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {mutation.isPending ? "Calculating..." : "Compare"}
                </Button>
              </div>
            </div>

            {mutation.isError && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
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
                    <TableRow>
                      <TableHead>Currency</TableHead>
                      <TableHead className="text-right">Equivalent Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{result.base_currency}</TableCell>
                      <TableCell className="text-right font-medium text-primary">
                        {formatNumber(result.amount)}
                      </TableCell>
                    </TableRow>
                    {result.conversions
                      .filter((c) => c.currency !== result.base_currency)
                      .map((c) => (
                        <TableRow key={c.currency}>
                          <TableCell className="font-medium">{c.currency}</TableCell>
                          <TableCell className="text-right">{formatNumber(c.amount)}</TableCell>
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
