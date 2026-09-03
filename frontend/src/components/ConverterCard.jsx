import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Star, RefreshCw, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useConvertMutation } from "@/hooks/useConversion";
import { useAddFavorite } from "@/hooks/useFavorites";
import { getCurrencies } from "@/services/api";
import CurrencyFlag from "@/components/CurrencyFlag";

const POPULAR = ["USD", "EUR", "GBP", "INR", "JPY", "CHF", "CAD", "AUD", "CNY"];

export default function ConverterCard({ onPairChange }) {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState("50000");
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
    <div className="space-y-6">
      {/* Exchange Form */}
      <Card className="border-border/50 bg-card/90 backdrop-blur-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Exchange</h2>
            <Button variant="ghost" size="sm" onClick={handleFavorite} className="gap-2 text-muted-foreground hover:text-cyan">
              <Star className="w-4 h-4" />
              Save Pair
            </Button>
          </div>
        </div>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-6 items-start">
            {/* Sell Side */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-cyan uppercase tracking-wider mb-2 block">Currency I Want To Sell</label>
                <Select value={from} onValueChange={(v) => { setFrom(v); setResult(null); }}>
                  <SelectTrigger className="h-14 bg-[#1a2540] border-border/50 text-base">
                    <div className="flex items-center gap-3">
                      <CurrencyFlag code={from} size="md" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-[#162032] border-border/50 shadow-xl shadow-black/50">
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="py-3">
                        <div className="flex items-center gap-3">
                          <CurrencyFlag code={c.code} size="sm" />
                          <div>
                            <span className="font-medium">{c.code}</span>
                            <span className="text-muted-foreground ml-2 text-xs">{c.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-cyan uppercase tracking-wider mb-2 block">Sell Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">$</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setResult(null); }}
                    className="pl-10 h-14 text-lg font-semibold bg-secondary/50 border-border/50"
                    placeholder="0.00"
                    min="0"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Available Balance: —</p>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center lg:pt-10">
              <Button
                variant="outline"
                size="icon"
                onClick={handleSwap}
                className="rounded-full h-12 w-12 border-cyan/30 hover:border-cyan hover:bg-cyan/10 transition-all"
              >
                <ArrowLeftRight className="w-5 h-5 text-cyan" />
              </Button>
            </div>

            {/* Buy Side */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-cyan uppercase tracking-wider mb-2 block">Currency I Want To Buy</label>
                <Select value={to} onValueChange={(v) => { setTo(v); setResult(null); }}>
                  <SelectTrigger className="h-14 bg-[#1a2540] border-border/50 text-base">
                    <div className="flex items-center gap-3">
                      <CurrencyFlag code={to} size="md" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] bg-[#162032] border-border/50 shadow-xl shadow-black/50">
                    {currencies.map((c) => (
                      <SelectItem key={c.code} value={c.code} className="py-3">
                        <div className="flex items-center gap-3">
                          <CurrencyFlag code={c.code} size="sm" />
                          <div>
                            <span className="font-medium">{c.code}</span>
                            <span className="text-muted-foreground ml-2 text-xs">{c.name}</span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-cyan uppercase tracking-wider mb-2 block">You Will Receive</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">₹</span>
                  <Input
                    readOnly
                    value={result ? formatNumber(result.converted_amount) : ""}
                    className="pl-10 h-14 text-lg font-semibold bg-secondary/30 border-border/50"
                    placeholder="0.00"
                  />
                </div>
                {result && (
                  <p className="text-xs text-muted-foreground mt-2">
                    1 {result.from} = {formatNumber(result.rate)} {result.to}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Convert Button */}
          <div className="mt-8">
            <Button
              onClick={handleConvert}
              disabled={convertMutation.isPending}
              className="w-full h-14 text-base font-semibold bg-cyan hover:bg-cyan/90 text-primary-foreground transition-all"
            >
              {convertMutation.isPending ? (
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <TrendingUp className="w-5 h-5 mr-2" />
              )}
              {convertMutation.isPending ? "Converting..." : "Convert"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Details */}
      {result && (
        <Card className="border-border/50 bg-card/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Your Conversion Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Selling:</span>
                <span className="text-sm font-medium">{formatCurrency(result.amount, result.from)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Buying:</span>
                <span className="text-sm font-medium text-cyan">{formatCurrency(result.converted_amount, result.to)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Exchange Rate:</span>
                <span className="text-sm font-medium">1 {result.from} = {formatNumber(result.rate)} {result.to}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last Updated:
                </span>
                <span className="text-xs text-muted-foreground">Live Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {convertMutation.isError && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{convertMutation.error.message}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function formatNumber(num) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num);
}

function formatCurrency(amount, currency) {
  const symbols = { USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥", CHF: "CHF", CAD: "C$", AUD: "A$" };
  const sym = symbols[currency] || currency + " ";
  return sym + formatNumber(amount);
}
