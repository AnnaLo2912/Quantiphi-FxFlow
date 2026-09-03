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
    <Card className="border-border/50 bg-card h-full">
      <div className="px-5 py-3.5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Currency Converter</h2>
          <Button variant="ghost" size="sm" onClick={handleFavorite} className="gap-1.5 text-muted-foreground hover:text-green h-8 px-2">
            <Star className="w-3.5 h-3.5" />
            <span className="text-xs">Save</span>
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-4 items-start">
          {/* From */}
          <div className="space-y-3">
            <label className="text-[10px] font-medium text-green uppercase tracking-wider">From</label>
            <Select value={from} onValueChange={(v) => { setFrom(v); setResult(null); }}>
              <SelectTrigger className="h-12 bg-[#1a1a1a] border-border/50 text-sm">
                <div className="flex items-center gap-2">
                  <CurrencyFlag code={from} size="sm" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-border/50 shadow-xl shadow-black/50 max-h-[250px]">
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="py-2">
                    <div className="flex items-center gap-2">
                      <CurrencyFlag code={c.code} size="sm" />
                      <span className="font-medium text-sm">{c.code}</span>
                      <span className="text-muted-foreground text-xs">{c.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setResult(null); }}
              className="h-12 text-base font-semibold"
              placeholder="Amount"
              min="0"
            />
            <p className="text-[11px] text-muted-foreground">{getCurrencyName(from)}</p>
          </div>

          {/* Swap */}
          <div className="flex justify-center lg:pt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="rounded-full h-10 w-10 border-green/30 hover:border-green hover:bg-green/10 transition-all"
            >
              <ArrowLeftRight className="w-4 h-4 text-green" />
            </Button>
          </div>

          {/* To */}
          <div className="space-y-3">
            <label className="text-[10px] font-medium text-green uppercase tracking-wider">To</label>
            <Select value={to} onValueChange={(v) => { setTo(v); setResult(null); }}>
              <SelectTrigger className="h-12 bg-[#1a1a1a] border-border/50 text-sm">
                <div className="flex items-center gap-2">
                  <CurrencyFlag code={to} size="md" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-border/50 shadow-xl shadow-black/50 max-h-[250px]">
                {currencies.map((c) => (
                  <SelectItem key={c.code} value={c.code} className="py-2">
                    <div className="flex items-center gap-2">
                      <CurrencyFlag code={c.code} size="sm" />
                      <span className="font-medium text-sm">{c.code}</span>
                      <span className="text-muted-foreground text-xs">{c.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              readOnly
              value={result ? formatNumber(result.converted_amount) : ""}
              className="h-12 text-base font-semibold bg-[#111]/60 border-border/50"
              placeholder="0.00"
            />
            {result && (
              <p className="text-[11px] text-muted-foreground">{getCurrencyName(to)}</p>
            )}
          </div>
        </div>

        {/* Rate */}
        {result && (
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>1 {result.from} = {formatNumber(result.rate)} {result.to}</span>
            <span className="text-border">|</span>
            <Clock className="w-3 h-3" />
            <span>Live</span>
          </div>
        )}

        {/* Convert */}
        <div className="mt-4">
          <Button
            onClick={handleConvert}
            disabled={convertMutation.isPending}
            className="w-full h-12 text-sm font-semibold bg-green hover:bg-green/90 text-black transition-all"
          >
            {convertMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="w-4 h-4 mr-2" />
            )}
            {convertMutation.isPending ? "Converting..." : "Convert"}
          </Button>
        </div>
      </CardContent>

      {/* Conversion Details */}
      {result && (
        <div className="px-5 pb-5">
          <Card className="bg-[#111] border-border/30">
            <CardContent className="p-4">
              <h4 className="text-xs font-semibold text-foreground mb-3">Conversion Details</h4>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">You Send</span>
                  <span className="text-xs font-medium">{formatCurrency(result.amount, result.from)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">You Receive</span>
                  <span className="text-xs font-medium text-green">{formatCurrency(result.converted_amount, result.to)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Rate</span>
                  <span className="text-xs font-medium">1 {result.from} = {formatNumber(result.rate)} {result.to}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Error */}
      {convertMutation.isError && (
        <div className="px-5 pb-5">
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-xs text-destructive">{convertMutation.error.message}</p>
          </div>
        </div>
      )}
    </Card>
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
