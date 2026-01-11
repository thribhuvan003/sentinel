import { forwardRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "./TransactionRow";
import { RiskScore } from "./RiskScore";
import { X, AlertTriangle, Building2, DollarSign, FileText, Brain, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TransactionDetailProps {
  transaction: Transaction | null;
  onClose: () => void;
  isOpen: boolean;
}

const anomalyReasons: Record<string, string[]> = {
  high: [
    "Transaction exceeds 3rd-degree standard deviation for this vendor.",
    "Velocity anomaly detected: 4x normal transaction frequency.",
    "Geographic risk: Payment destination flagged in high-risk jurisdiction.",
    "Pattern match: Similar to known invoice duplication scheme.",
  ],
  medium: [
    "First-time vendor with insufficient verification history.",
    "Transaction amount rounded to suspicious denomination.",
    "Timing anomaly: Transaction outside normal business hours.",
  ],
  low: [
    "Transaction within expected parameters for vendor profile.",
    "Standard verification checks passed.",
  ],
};

export const TransactionDetail = forwardRef<HTMLDivElement, TransactionDetailProps>(
  ({ transaction, onClose, isOpen }, ref) => {
    // Lock body scroll when panel is open
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
      return () => {
        document.body.style.overflow = "";
      };
    }, [isOpen]);

    const handleMarkReviewed = () => {
      if (transaction) {
        toast.success(`Transaction ${transaction.id} marked as reviewed`);
        onClose();
      }
    };

    const handleEscalate = () => {
      if (transaction) {
        toast.error(`Transaction ${transaction.id} escalated for investigation`);
        onClose();
      }
    };

    const getRiskCategory = (score: number) => {
      if (score <= 30) return "low";
      if (score <= 60) return "medium";
      return "high";
    };

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const riskCategory = transaction ? getRiskCategory(transaction.riskScore) : "low";
    const reasons = anomalyReasons[riskCategory];

    return (
      <AnimatePresence>
        {isOpen && transaction && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              onClick={onClose}
            />

            {/* Panel */}
            <motion.div
              ref={ref}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-md z-50"
            >
              <div className="h-full bg-card border-l border-border shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg",
                      riskCategory === "high" && "bg-destructive/10",
                      riskCategory === "medium" && "bg-warning/10",
                      riskCategory === "low" && "bg-primary/10"
                    )}>
                      <FileText className={cn(
                        "w-5 h-5",
                        riskCategory === "high" && "text-destructive",
                        riskCategory === "medium" && "text-warning",
                        riskCategory === "low" && "text-primary"
                      )} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Transaction Details</h2>
                      <p className="text-xs text-muted-foreground font-mono">{transaction.id}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto sentinel-scrollbar p-6 space-y-6">
                  {/* Risk Overview */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border",
                      riskCategory === "high" && "bg-destructive/5 border-destructive/20",
                      riskCategory === "medium" && "bg-warning/5 border-warning/20",
                      riskCategory === "low" && "bg-primary/5 border-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-foreground">Risk Assessment</span>
                      <RiskScore score={transaction.riskScore} size="lg" />
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {riskCategory === "high" && (
                        <>
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span className="text-destructive font-medium">Critical attention required</span>
                        </>
                      )}
                      {riskCategory === "medium" && (
                        <span className="text-warning font-medium">Manual review recommended</span>
                      )}
                      {riskCategory === "low" && (
                        <span className="text-primary font-medium">Within acceptable parameters</span>
                      )}
                    </div>
                  </motion.div>

                  {/* Entity Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      Entity Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Entity Name</p>
                        <p className="text-sm font-medium text-foreground">{transaction.entity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Department</p>
                        <p className="text-sm font-medium text-foreground">{transaction.department}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Transaction Type</p>
                        <p className="text-sm font-medium text-foreground">{transaction.type}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <span className={cn(
                          "text-sm font-medium capitalize",
                          transaction.status === "flagged" && "text-destructive",
                          transaction.status === "cleared" && "text-primary",
                          transaction.status === "pending" && "text-muted-foreground"
                        )}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Financial Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      Financial Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-lg font-bold font-mono tabular-nums text-foreground">
                          {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Timestamp</p>
                        <p className="text-sm font-mono text-foreground">{transaction.timestamp}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* AI Reasoning */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Brain className="w-4 h-4 text-accent" />
                      AI Analysis & Reasoning
                    </h3>
                    <div className="space-y-3">
                      {reasons.map((reason, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                        >
                          <div className={cn(
                            "w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0",
                            riskCategory === "high" && "bg-destructive",
                            riskCategory === "medium" && "bg-warning",
                            riskCategory === "low" && "bg-primary"
                          )} />
                          <p className="text-sm text-foreground/90">{reason}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Historical Context */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="space-y-4"
                  >
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      Historical Context
                    </h3>
                    <div className="p-3 rounded-lg bg-muted/50 border border-border">
                      <p className="text-sm text-foreground/90">
                        This vendor has processed <span className="font-semibold text-foreground">23 transactions</span> totaling{" "}
                        <span className="font-semibold font-mono text-foreground">$2.4M</span> over the past 12 months.
                        Average transaction value: <span className="font-mono">$104,347</span>.
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 border-t border-border bg-muted/20 flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={handleMarkReviewed}>
                    Mark as Reviewed
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={handleEscalate}>
                    Escalate Issue
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

TransactionDetail.displayName = "TransactionDetail";
