import { useHistoricalRates } from "@/hooks/useHistoricalRates";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CurrencyFlag from "@/components/CurrencyFlag";

export default function RateChart({ from, to }) {
  const { data, isLoading, isError } = useHistoricalRates(from, to, 30);

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/90">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <Card className="border-border/50 bg-card/90">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{from} → {to}</h3>
          <p className="text-sm text-muted-foreground">Unable to load historical data.</p>
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
    <Card className="border-border/50 bg-card/90">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <CurrencyFlag code={from} size="md" />
              <CurrencyFlag code={to} size="md" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{from}{to} Exchange Rate</h3>
              <p className="text-xs text-muted-foreground uppercase">30 Day Chart</p>
            </div>
          </div>
          <button className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-accent transition-colors">
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Rate Display */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">{latestRate?.toFixed(4)}</span>
            <span className={`text-sm font-medium flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              <TrendingUp className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} />
              {isPositive ? '+' : ''}{changePercent}% ({isPositive ? '+' : ''}{change.toFixed(4)})
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[280px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={{ stroke: "#1e293b" }}
                tickLine={false}
              />
              <YAxis
                domain={[minRate - padding, maxRate + padding]}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#162032",
                  border: "1px solid #1e293b",
                  borderRadius: "8px",
                  fontSize: "12px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
                labelStyle={{ color: "#94a3b8" }}
                itemStyle={{ color: "#22d3ee" }}
                formatter={(value) => [value.toFixed(4), "Rate"]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#22d3ee"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRate)"
                activeDot={{ r: 5, fill: "#22d3ee", stroke: "#0b1120", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
