import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHistoricalRates } from "@/hooks/useHistoricalRates";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, ArrowLeftRight } from "lucide-react";
import CurrencySelect from "@/components/CurrencySelect";
import { getCurrencies } from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FLAGS = {
  USD: "🇺🇸", EUR: "🇪🇺", GBP: "🇬🇧", INR: "🇮🇳", JPY: "🇯🇵", CHF: "🇨🇭",
  CAD: "🇨🇦", AUD: "🇦🇺", CNY: "🇨🇳", BRL: "🇧🇷",
};

const POPULAR = ["USD", "EUR", "GBP", "INR", "JPY", "CHF", "CAD", "AUD", "CNY"];

export default function RateChart({ from, to, onPairChange }) {
  const [chartFrom, setChartFrom] = useState(from);
  const [chartTo, setChartTo] = useState(to);

  const { data: currencyData } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    staleTime: 3600000,
  });

  const currencies = currencyData?.currencies || POPULAR.map((c) => ({ code: c, name: c }));

  useEffect(() => {
    setChartFrom(from);
    setChartTo(to);
  }, [from, to]);

  const handleFromChange = (val) => {
    setChartFrom(val);
    onPairChange?.(val, chartTo);
  };

  const handleToChange = (val) => {
    setChartTo(val);
    onPairChange?.(chartFrom, val);
  };

  const handleSwap = () => {
    setChartFrom(chartTo);
    setChartTo(chartFrom);
    onPairChange?.(chartTo, chartFrom);
  };

  const { data, isLoading, isError } = useHistoricalRates(chartFrom, chartTo, 30);

  if (isLoading) {
    return (
      <Card className="border-border bg-card h-full">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-[180px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <Card className="border-border bg-card h-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-foreground">FX Trends</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <CurrencySelect value={chartFrom} onValueChange={handleFromChange} currencies={currencies} placeholder="From" />
            <Button variant="ghost" size="icon" onClick={handleSwap} className="h-8 w-8 shrink-0">
              <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Button>
            <CurrencySelect value={chartTo} onValueChange={handleToChange} currencies={currencies} placeholder="To" />
          </div>
          <p className="text-xs text-muted-foreground">Unable to load historical data.</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.data.map((d) => ({
    date: d.date.slice(5),
    rate: d.rate,
  }));

  const minRate = Math.min(...chartData.map((d) => d.rate));
  const maxRate = Math.max(...chartData.map((d) => d.rate));
  const padding = (maxRate - minRate) * 0.1 || 1;
  const latestRate = chartData[chartData.length - 1]?.rate;
  const firstRate = chartData[0]?.rate;
  const change = latestRate - firstRate;
  const changePercent = ((change / firstRate) * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <Card className="border-border bg-card h-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-foreground">FX Trends</span>
          <span className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-green' : 'text-red-500'}`}>
            <TrendingUp className={`w-3 h-3 ${!isPositive ? 'rotate-180' : ''}`} />
            {isPositive ? '+' : ''}{changePercent}%
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <CurrencySelect value={chartFrom} onValueChange={handleFromChange} currencies={currencies} placeholder="From" />
          <Button variant="ghost" size="icon" onClick={handleSwap} className="h-8 w-8 shrink-0">
            <ArrowLeftRight className="w-3.5 h-3.5 text-muted-foreground" />
          </Button>
          <CurrencySelect value={chartTo} onValueChange={handleToChange} currencies={currencies} placeholder="To" />
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <span className="text-sm">{FLAGS[chartFrom] || "🏳️"}</span>
            <span className="text-sm">{FLAGS[chartTo] || "🏳️"}</span>
          </div>
          <div>
            <h3 className="text-xs font-semibold">{chartFrom}{chartTo}</h3>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">30 Day History</p>
          </div>
          <span className="ml-auto text-lg font-bold">{latestRate?.toFixed(4)}</span>
        </div>

        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
                tickLine={false}
              />
              <YAxis
                domain={[minRate - padding, maxRate + padding]}
                tick={{ fontSize: 10 }}
                className="text-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toFixed(2)}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
                formatter={(value) => [value.toFixed(4), "Rate"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#22c55e", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
