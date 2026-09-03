import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftRight, Star, RefreshCw, TrendingUp, Clock, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useConvertMutation } from "@/hooks/useConversion";
import { useAddFavorite } from "@/hooks/useFavorites";
import { getCurrencies } from "@/services/api";
import CurrencySelect from "@/components/CurrencySelect";

const POPULAR = ["USD", "EUR", "GBP", "INR", "JPY", "CHF", "CAD", "AUD", "CNY"];

export default function ConverterCard({ onPairChange }) {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [amount, setAmount] = useState("1000");
  const [result, setResult] = useState(null);
  const [favSaved, setFavSaved] = useState(false);

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

  const [favError, setFavError] = useState(false);

  const handleFavorite = () => {
    setFavSaved(false);
    setFavError(false);
    addFavorite.mutate(
      { from, to },
      {
        onSuccess: () => {
          setFavSaved(true);
          setTimeout(() => setFavSaved(false), 2000);
        },
        onError: (err) => {
          if (err.message?.includes("already exists")) {
            setFavSaved(true);
            setTimeout(() => setFavSaved(false), 2000);
          } else {
            setFavError(true);
            setTimeout(() => setFavError(false), 2000);
          }
        },
      }
    );
  };

  const getCurrencyName = (code) => currencies.find((c) => c.code === code)?.name || code;

  return (
    <Card className="border-border bg-card h-full">
      <div className="px-4 py-2.5 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-foreground">Currency Converter</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            disabled={addFavorite.isPending}
            className="gap-1.5 text-muted-foreground hover:text-green h-8 px-2"
          >
            {favSaved ? (
              <Check className="w-3.5 h-3.5 text-green" />
            ) : (
              <Star className="w-3.5 h-3.5" />
            )}
            <span className="text-xs">
              {addFavorite.isPending ? "Saving..." : favSaved ? "Saved" : "Save"}
            </span>
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-3 items-start">
          <div className="space-y-3">
            <label className="text-[9px] font-medium text-green uppercase tracking-wider">From</label>
            <CurrencySelect value={from} onValueChange={(v) => { setFrom(v); setResult(null); }} currencies={currencies} />
            <Input
              type="number"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setResult(null); }}
              className="h-10 text-sm font-semibold bg-background"
              placeholder="Amount"
              min="0"
            />
            <p className="text-[10px] text-muted-foreground">{getCurrencyName(from)}</p>
          </div>

          <div className="flex justify-center lg:pt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwap}
              className="rounded-full h-8 w-8 border-green/30 hover:border-green hover:bg-green/10 transition-all"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-green" />
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-medium text-green uppercase tracking-wider">To</label>
            <CurrencySelect value={to} onValueChange={(v) => { setTo(v); setResult(null); }} currencies={currencies} />
            <Input
              readOnly
              value={result ? formatNumber(result.converted_amount) : ""}
              className="h-10 text-sm font-semibold bg-background"
              placeholder="0.00"
            />
            {result && (
              <p className="text-[10px] text-muted-foreground">{getCurrencyName(to)}</p>
            )}
          </div>
        </div>

        {result && (
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <span>1 {result.from} = {formatNumber(result.rate)} {result.to}</span>
            <span className="text-border">|</span>
            <Clock className="w-2.5 h-2.5" />
            <span>Live</span>
          </div>
        )}

        <div className="mt-3">
          <Button
            onClick={handleConvert}
            disabled={convertMutation.isPending}
            className="w-full h-10 text-sm font-semibold bg-green hover:bg-green/90 text-primary-foreground transition-all"
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

      {result && (
        <div className="px-4 pb-3">
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">You Send</span>
                  <span className="text-[11px] font-medium">{formatCurrency(result.amount, result.from)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-muted-foreground">You Receive</span>
                  <span className="text-[11px] font-medium text-green">{formatCurrency(result.converted_amount, result.to)}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-border">
                  <span className="text-[11px] text-muted-foreground">Rate</span>
                  <span className="text-[11px] font-medium">1 {result.from} = {formatNumber(result.rate)} {result.to}</span>
                </div>
              </div>
          </div>
        </div>
      )}

      {convertMutation.isError && (
        <div className="px-4 pb-3">
          <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 text-destructive" />
            <p className="text-[11px] text-destructive">{convertMutation.error.message}</p>
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
