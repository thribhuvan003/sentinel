import { useState, useEffect, useRef, forwardRef, useMemo } from "react";
import { TransactionRow, Transaction } from "./TransactionRow";
import { Activity } from "lucide-react";
import { FilterDropdown, FilterState } from "./FilterDropdown";
import { cn } from "@/lib/utils";

interface TransactionFeedProps {
  transactions: Transaction[];
  onTransactionClick: (transaction: Transaction) => void;
  selectedId?: string | null;
  focusedIndex?: number;
}

export const TransactionFeed = forwardRef<HTMLDivElement, TransactionFeedProps>(
  ({ transactions, onTransactionClick, selectedId, focusedIndex }, ref) => {
    const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
    const [newIds, setNewIds] = useState<Set<string>>(new Set());
    const [filters, setFilters] = useState<FilterState>({
      departments: [],
      riskLevels: [],
      statuses: [],
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

    useEffect(() => {
      // Simulate real-time feed by adding transactions one by one
      const initialBatch = transactions.slice(0, 8);
      setDisplayedTransactions(initialBatch);

      let currentIndex = 8;
      const interval = setInterval(() => {
        if (currentIndex < transactions.length) {
          const newTransaction = transactions[currentIndex];
          setNewIds((prev) => new Set([...prev, newTransaction.id]));
          setDisplayedTransactions((prev) => [newTransaction, ...prev.slice(0, 14)]);
          currentIndex++;

          // Remove "new" status after animation
          setTimeout(() => {
            setNewIds((prev) => {
              const next = new Set(prev);
              next.delete(newTransaction.id);
              return next;
            });
          }, 2000);
        }
      }, 3000);

      return () => clearInterval(interval);
    }, [transactions]);

    // Scroll focused row into view
    useEffect(() => {
      if (focusedIndex !== undefined && focusedIndex >= 0) {
        const filteredTxns = filteredTransactions;
        if (filteredTxns[focusedIndex]) {
          const rowEl = rowRefs.current.get(filteredTxns[focusedIndex].id);
          rowEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }
    }, [focusedIndex]);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
      return displayedTransactions.filter((txn) => {
        // Department filter
        if (filters.departments.length > 0 && !filters.departments.includes(txn.department)) {
          return false;
        }

        // Risk level filter
        if (filters.riskLevels.length > 0) {
          const matchesRisk = filters.riskLevels.some((level) => {
            if (level.includes("Low") && txn.riskScore <= 30) return true;
            if (level.includes("Medium") && txn.riskScore > 30 && txn.riskScore <= 60) return true;
            if (level.includes("High") && txn.riskScore > 60) return true;
            return false;
          });
          if (!matchesRisk) return false;
        }

        // Status filter
        if (filters.statuses.length > 0 && !filters.statuses.includes(txn.status)) {
          return false;
        }

        return true;
      });
    }, [displayedTransactions, filters]);

    const setRowRef = (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        rowRefs.current.set(id, el);
      } else {
        rowRefs.current.delete(id);
      }
    };

    return (
      <div ref={ref} className="sentinel-card-elevated flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Real-time Transaction Feed</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary sentinel-pulse" />
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
          </div>
          <FilterDropdown filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border/50 bg-muted/30">
          <div className="col-span-2">Timestamp</div>
          <div className="col-span-3">Entity</div>
          <div className="col-span-2">Department</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2">Risk Score</div>
          <div className="col-span-1 text-right">Status</div>
        </div>

        {/* Transaction List */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto sentinel-scrollbar"
        >
          {filteredTransactions.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              No transactions match the current filters
            </div>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <div
                key={transaction.id}
                ref={setRowRef(transaction.id)}
                className={cn(
                  focusedIndex === index && "ring-2 ring-primary ring-inset"
                )}
              >
                <TransactionRow
                  transaction={transaction}
                  onClick={onTransactionClick}
                  isNew={newIds.has(transaction.id)}
                  isSelected={selectedId === transaction.id}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            Showing {filteredTransactions.length} of {displayedTransactions.length} transactions
            {filters.departments.length > 0 || filters.riskLevels.length > 0 || filters.statuses.length > 0
              ? " (filtered)"
              : ""}
          </p>
        </div>
      </div>
    );
  }
);

TransactionFeed.displayName = "TransactionFeed";
