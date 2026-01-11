import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface RiskScoreProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

export const RiskScore = forwardRef<HTMLDivElement, RiskScoreProps>(({ score, size = "md" }, ref) => {
  const getRiskLevel = (score: number) => {
    if (score <= 30) return { label: "LOW", color: "text-primary", bg: "bg-primary/20", bar: "risk-gradient-low" };
    if (score <= 60) return { label: "MED", color: "text-warning", bg: "bg-warning/20", bar: "risk-gradient-medium" };
    return { label: "HIGH", color: "text-destructive", bg: "bg-destructive/20", bar: "risk-gradient-high" };
  };

  const risk = getRiskLevel(score);

  const sizeClasses = {
    sm: "w-12 text-xs",
    md: "w-16 text-sm",
    lg: "w-20 text-base",
  };

  return (
    <div ref={ref} className={cn("flex items-center gap-2", sizeClasses[size])}>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", risk.bar)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("font-mono font-semibold tabular-nums", risk.color)}>
        {score}
      </span>
    </div>
  );
});

RiskScore.displayName = "RiskScore";
