import { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "primary" | "destructive" | "warning" | "accent";
  subtitle?: string;
}

const variantStyles = {
  primary: {
    glow: "sentinel-glow-primary",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    border: "border-primary/20",
    accent: "bg-primary",
  },
  destructive: {
    glow: "sentinel-glow-destructive",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    border: "border-destructive/20",
    accent: "bg-destructive",
  },
  warning: {
    glow: "",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    border: "border-warning/20",
    accent: "bg-warning",
  },
  accent: {
    glow: "sentinel-glow-accent",
    iconBg: "bg-accent/10",
    iconColor: "text-accent",
    border: "border-accent/20",
    accent: "bg-accent",
  },
};

export const KPICard = forwardRef<HTMLDivElement, KPICardProps>(
  ({ title, value, icon: Icon, trend, variant = "primary", subtitle }, ref) => {
    const styles = variantStyles[variant];

    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn(
          "sentinel-card-elevated p-5 relative overflow-hidden group cursor-default",
          styles.glow,
          styles.border
        )}
      >
        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.div
            animate={{ y: ["-100%", "200%"] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 1 
            }}
            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          />
        </div>

        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold font-mono tabular-nums text-foreground"
            >
              {value}
            </motion.p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
            {trend && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1"
              >
                <motion.span
                  animate={trend.isPositive ? { y: [0, -2, 0] } : { y: [0, 2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-primary" : "text-destructive"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                </motion.span>
                <span className="text-xs text-muted-foreground">vs last week</span>
              </motion.div>
            )}
          </div>

          <motion.div
            whileHover={{ rotate: 5 }}
            className={cn("p-3 rounded-lg", styles.iconBg)}
          >
            <Icon className={cn("w-5 h-5", styles.iconColor)} />
          </motion.div>
        </div>

        {/* Bottom accent line with pulse */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={cn("absolute bottom-0 left-0 right-0 h-0.5", styles.accent)}
        />
      </motion.div>
    );
  }
);

KPICard.displayName = "KPICard";
