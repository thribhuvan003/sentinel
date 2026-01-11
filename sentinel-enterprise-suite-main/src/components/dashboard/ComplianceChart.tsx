import { forwardRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Building2 } from "lucide-react";

const data = [
  { department: "Finance", compliance: 98, target: 95 },
  { department: "Operations", compliance: 87, target: 95 },
  { department: "Sales", compliance: 92, target: 95 },
  { department: "Legal", compliance: 99, target: 95 },
  { department: "IT", compliance: 94, target: 95 },
  { department: "HR", compliance: 96, target: 95 },
  { department: "Procurement", compliance: 82, target: 95 },
];

const getBarColor = (compliance: number, target: number) => {
  if (compliance >= target) return "hsl(160, 84%, 39%)";
  if (compliance >= target - 10) return "hsl(38, 92%, 50%)";
  return "hsl(0, 72%, 51%)";
};

const CustomTooltip = forwardRef<HTMLDivElement, any>(({ active, payload, label }, ref) => {
  if (active && payload && payload.length) {
    const compliance = payload[0]?.value;
    const target = payload[0]?.payload?.target;
    const diff = compliance - target;

    return (
      <div ref={ref} className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs font-medium text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-xs">
            <span className="text-muted-foreground">Compliance: </span>
            <span className="font-mono font-semibold text-foreground">{compliance}%</span>
          </p>
          <p className="text-xs">
            <span className="text-muted-foreground">vs Target: </span>
            <span className={`font-mono font-semibold ${diff >= 0 ? "text-primary" : "text-destructive"}`}>
              {diff >= 0 ? "+" : ""}{diff}%
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
});

CustomTooltip.displayName = "CustomTooltip";

export function ComplianceChart() {
  return (
    <div className="sentinel-card-elevated p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Departmental Compliance</h3>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Target:</span>
          <span className="text-xs font-mono font-semibold text-foreground">95%</span>
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" horizontal={false} />
            <XAxis 
              type="number"
              domain={[0, 100]}
              tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 10 }}
              axisLine={{ stroke: "hsl(220, 14%, 18%)" }}
              tickLine={false}
            />
            <YAxis 
              type="category"
              dataKey="department"
              tick={{ fill: "hsl(215, 16%, 55%)", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(220, 14%, 14%)" }} />
            <Bar dataKey="compliance" radius={[0, 4, 4, 0]} barSize={16}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.compliance, entry.target)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span className="text-xs text-muted-foreground">On Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-warning" />
          <span className="text-xs text-muted-foreground">Near Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-destructive" />
          <span className="text-xs text-muted-foreground">Below Target</span>
        </div>
      </div>
    </div>
  );
}
