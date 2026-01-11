import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { RiskScore } from "./RiskScore";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

export interface Transaction {
  id: string;
  timestamp: string;
  entity: string;
  amount: number;
  riskScore: number;
  status: "pending" | "flagged" | "cleared";
  department: string;
  type: string;
}

interface TransactionRowProps {
  transaction: Transaction;
  onClick: (transaction: Transaction) => void;
  isNew?: boolean;
  isSelected?: boolean;
}

export const TransactionRow = forwardRef<HTMLDivElement, TransactionRowProps>(
  ({ transaction, onClick, isNew, isSelected }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const statusConfig = {
      pending: { icon: Clock, color: "text-muted-foreground", label: "Pending" },
      flagged: { icon: AlertTriangle, color: "text-destructive", label: "Flagged" },
      cleared: { icon: CheckCircle, color: "text-primary", label: "Cleared" },
    };

    const status = statusConfig[transaction.status];
    const StatusIcon = status.icon;

    const handleClick = () => {
      onClick(transaction);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(transaction);
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "transaction-row grid grid-cols-12 gap-4 items-center px-4 py-3 cursor-pointer border-b border-border/50",
          "hover:bg-primary/5 focus:outline-none focus:bg-primary/10",
          "transition-all duration-200",
          isNew && "animate-fade-in bg-primary/10",
          isSelected && "bg-primary/15 border-l-2 border-l-primary"
        )}
      >
        {/* Timestamp */}
        <div className="col-span-2">
          <span className="font-mono text-xs text-muted-foreground tabular-nums">
            {transaction.timestamp}
          </span>
        </div>

        {/* Entity */}
        <div className="col-span-3">
          <p className="text-sm font-medium text-foreground truncate">
            {transaction.entity}
          </p>
          <p className="text-xs text-muted-foreground">{transaction.type}</p>
        </div>

        {/* Department */}
        <div className="col-span-2">
          <span className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
            {transaction.department}
          </span>
        </div>

        {/* Amount */}
        <div className="col-span-2 text-right">
          <span className={cn(
            "font-mono text-sm font-semibold tabular-nums",
            transaction.amount >= 1000000 ? "text-warning" : "text-foreground"
          )}>
            {formatCurrency(transaction.amount)}
          </span>
        </div>

        {/* Risk Score */}
        <div className="col-span-2">
          <RiskScore score={transaction.riskScore} size="md" />
        </div>

        {/* Status */}
        <div className="col-span-1 flex justify-end">
          <StatusIcon className={cn("w-4 h-4", status.color)} />
        </div>
      </div>
    );
  }
);

TransactionRow.displayName = "TransactionRow";
