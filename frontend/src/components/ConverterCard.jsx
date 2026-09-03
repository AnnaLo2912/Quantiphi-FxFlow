import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Star, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useConvertMutation } from "@/hooks/useConversion";
import { useAddFavorite } from "@/hooks/useFavorites";
import { getCurrencies } from "@/services/api";
import { formatCurrency, timeAgo } from "@/lib/utils";

const POPULAR = ["USD", "EUR", "GBP", "INR", "JPY", "CHF", "CAD", "AUD", "CNY"];

export default function ConverterCard({ onPairChange }) {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState("1000");
  const [result, setResult] = useState(null);

  const { data: currencyData } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    staleTime: 3600000,
  });

  const currencies = currencyData?.currencies || POPULAR.map((c) => ({ code: c, name: c }));

  const convertMutation = useConvertMutation();
  const addFavorite = useAddFavorite();

  useEffect(() => {
    if (from && to) onPairChange?.(from, to);
  }, [from, to]);

  const handleConvert = () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;
    convertMutation.mutate(
      { from, to, amount: num },
      { onSuccess: (data) => setResult(data) }
    );
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  const handleFavorite = () => {
    addFavorite.mutate({ from, to });
  };

  const getCurrencyName = (code) => currencies.find((c) => c.code === code)?.name || code;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Currency Converter</h2>
          <Button variant="ghost" size="icon" onClick={handleFavorite} title="Save to favorites">
            <Star className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">From</label>
            <Select value={from} onValueChange={(v) => { setFrom(v); setResult(null); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="font-medium">{c.code}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setResult(null); }}
                className="pl-7 text-lg font-medium"
                placeholder="Amount"
                min="0"
              />
            </div>
            <p className="text-xs text-muted-foreground">{getCurrencyName(from)}</p>
          </div>

          <div className="flex justify-center pb-2">
            <Button variant="outline" size="icon" onClick={handleSwap} className="rounded-full h-10 w-10 shrink-0">
              <ArrowLeftRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground font-medium">To</label>
            <Select value={to} onValueChange={(v) => { setTo(v); setResult(null); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="font-medium">{c.code}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
              <Input
                readOnly
                value={result ? formatNumber(result.converted_amount) : ""}
                className="pl-7 text-lg font-medium bg-muted/30"
                placeholder="Result"
              />
            </div>
            <p className="text-xs text-muted-foreground">{getCurrencyName(to)}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button onClick={handleConvert} disabled={convertMutation.isPending} className="w-full sm:w-auto">
            {convertMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            {convertMutation.isPending ? "Converting..." : "Convert"}
          </Button>

          {result && (
            <div className="text-center sm:text-right">
              <p className="text-sm text-muted-foreground">
                1 {result.from} = {formatCurrency(result.rate, result.to)}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center sm:justify-end mt-1">
                <Clock className="w-3 h-3" />
                Last updated: {timeAgo(result.timestamp)}
              </p>
            </div>
          )}
        </div>

        {convertMutation.isError && (
          <div className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{convertMutation.error.message}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatNumber(num) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
