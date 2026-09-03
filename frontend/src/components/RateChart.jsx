import { useHistoricalRates } from "@/hooks/useHistoricalRates";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RateChart({ from, to }) {
  const { data, isLoading, isError } = useHistoricalRates(from, to, 30);

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <Card className="border-border/50 bg-card/80">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">{from} → {to} — 30-Day Exchange Rate</h3>
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

  return (
    <Card className="border-border/50 bg-card/80">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">{from} → {to}</h3>
            <p className="text-sm text-muted-foreground">30-Day Exchange Rate</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-primary">
              {chartData[chartData.length - 1]?.rate.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Latest Rate</p>
          </div>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={{ stroke: "#27272a" }}
                tickLine={false}
              />
              <YAxis
                domain={[minRate - padding, maxRate + padding]}
                tick={{ fontSize: 11, fill: "#71717a" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => v.toFixed(2)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#18181f",
                  border: "1px solid #27272a",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#22c55e" }}
                formatter={(value) => [value.toFixed(4), "Rate"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#22c55e", stroke: "#000", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
