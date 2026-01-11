import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { date: "Jan", riskScore: 45, volume: 320 },
  { date: "Feb", riskScore: 52, volume: 280 },
  { date: "Mar", riskScore: 38, volume: 450 },
  { date: "Apr", riskScore: 65, volume: 380 },
  { date: "May", riskScore: 48, volume: 520 },
  { date: "Jun", riskScore: 72, volume: 410 },
  { date: "Jul", riskScore: 55, volume: 380 },
  { date: "Aug", riskScore: 42, volume: 490 },
  { date: "Sep", riskScore: 58, volume: 520 },
  { date: "Oct", riskScore: 35, volume: 580 },
  { date: "Nov", riskScore: 48, volume: 620 },
  { date: "Dec", riskScore: 41, volume: 540 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs">
            <span className="text-muted-foreground">Avg Risk: </span>
            <span className="font-mono font-semibold text-primary">{payload[0]?.value}</span>
          </p>
          <p className="text-xs">
            <span className="text-muted-foreground">Transactions: </span>
            <span className="font-mono font-semibold text-foreground">{payload[1]?.value}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function RiskTrendChart() {
  return (
    <div className="sentinel-card-elevated p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Risk Trends</h3>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="hsl(200, 80%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 10 }}
              axisLine={{ stroke: "hsl(220, 14%, 18%)" }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="riskScore"
              stroke="hsl(160, 84%, 39%)"
              strokeWidth={2}
              fill="url(#riskGradient)"
            />
            <Area
              type="monotone"
              dataKey="volume"
              stroke="hsl(200, 80%, 50%)"
              strokeWidth={1.5}
              fill="url(#volumeGradient)"
              strokeDasharray="5 5"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary rounded" />
          <span className="text-xs text-muted-foreground">Avg Risk Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-accent rounded" style={{ background: 'repeating-linear-gradient(90deg, hsl(200, 80%, 50%), hsl(200, 80%, 50%) 4px, transparent 4px, transparent 8px)' }} />
          <span className="text-xs text-muted-foreground">Transaction Volume</span>
        </div>
      </div>
    </div>
  );
}
