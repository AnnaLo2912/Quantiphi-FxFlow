import { useHistoricalRates } from "@/hooks/useHistoricalRates";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Maximize2, TrendingUp } from "lucide-react";
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

export default function RateChart({ from, to }) {
  const { data, isLoading, isError } = useHistoricalRates(from, to, 30);

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card h-full">
        <CardContent className="p-5">
          <Skeleton className="h-5 w-40 mb-4" />
          <Skeleton className="h-[220px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <Card className="border-border/50 bg-card h-full">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold mb-2">{from} → {to}</h3>
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
    <Card className="border-border/50 bg-card h-full">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{FLAGS[from] || "🏳️"}</span>
              <span className="text-lg">{FLAGS[to] || "🏳️"}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold">{from}{to}</h3>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">30 Day History</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium flex items-center gap-1 ${isPositive ? 'text-green' : 'text-red-400'}`}>
              <TrendingUp className={`w-3 h-3 ${!isPositive ? 'rotate-180' : ''}`} />
              {isPositive ? '+' : ''}{changePercent}%
            </span>
          </div>
        </div>

        <div className="mb-3">
          <span className="text-2xl font-bold">{latestRate?.toFixed(4)}</span>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#737373" }}
                axisLine={{ stroke: "#262626" }}
                tickLine={false}
              />
              <YAxis
                domain={[minRate - padding, maxRate + padding]}
                tick={{ fontSize: 10, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toFixed(2)}
                width={50}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  fontSize: "11px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                }}
                labelStyle={{ color: "#a3a3a3" }}
                itemStyle={{ color: "#22c55e" }}
                formatter={(value) => [value.toFixed(4), "Rate"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#22c55e", stroke: "#0a0a0a", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
