import { useState, useRef, useMemo, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { KPICard } from "@/components/dashboard/KPICard";
import { TransactionFeed } from "@/components/dashboard/TransactionFeed";
import { TransactionDetail } from "@/components/dashboard/TransactionDetail";
import { AuditSidebar } from "@/components/dashboard/AuditSidebar";
import { RiskTrendChart } from "@/components/dashboard/RiskTrendChart";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { Transaction } from "@/components/dashboard/TransactionRow";
import { mockTransactions } from "@/data/mockTransactions";
import { DollarSign, AlertTriangle, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const Index = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const searchRef = useRef<HTMLInputElement>(null);

  // Get displayed transactions for keyboard navigation
  const displayedTransactions = useMemo(() => {
    return mockTransactions.slice(0, 15);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedTransaction(null);
    setFocusedIndex(-1);
    toast.info("Panel closed");
  }, []);

  const handleSearch = useCallback(() => {
    searchRef.current?.focus();
    toast.info("Search focused (⌘K)");
  }, []);

  const handleAudit = useCallback(() => {
    const auditButton = document.querySelector('[data-audit-button]') as HTMLButtonElement;
    if (auditButton && !auditButton.disabled) {
      auditButton.click();
      toast.info("Audit triggered (⌘A)");
    }
  }, []);

  const handleArrowUp = useCallback(() => {
    if (selectedTransaction) {
      const currentIndex = displayedTransactions.findIndex(t => t.id === selectedTransaction.id);
      if (currentIndex > 0) {
        const newTransaction = displayedTransactions[currentIndex - 1];
        setSelectedTransaction(newTransaction);
        setFocusedIndex(currentIndex - 1);
      }
    } else {
      // Navigate in feed without opening
      setFocusedIndex(prev => Math.max(0, prev - 1));
    }
  }, [selectedTransaction, displayedTransactions]);

  const handleArrowDown = useCallback(() => {
    if (selectedTransaction) {
      const currentIndex = displayedTransactions.findIndex(t => t.id === selectedTransaction.id);
      if (currentIndex < displayedTransactions.length - 1) {
        const newTransaction = displayedTransactions[currentIndex + 1];
        setSelectedTransaction(newTransaction);
        setFocusedIndex(currentIndex + 1);
      }
    } else {
      // Navigate in feed without opening
      setFocusedIndex(prev => Math.min(displayedTransactions.length - 1, prev + 1));
    }
  }, [selectedTransaction, displayedTransactions]);

  const handleEnter = useCallback(() => {
    if (focusedIndex >= 0 && focusedIndex < displayedTransactions.length && !selectedTransaction) {
      setSelectedTransaction(displayedTransactions[focusedIndex]);
    }
  }, [focusedIndex, displayedTransactions, selectedTransaction]);

  const handleTransactionClick = useCallback((transaction: Transaction) => {
    setSelectedTransaction(transaction);
    const index = displayedTransactions.findIndex(t => t.id === transaction.id);
    setFocusedIndex(index);
  }, [displayedTransactions]);

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    onEscape: handleCloseDetail,
    onSearch: handleSearch,
    onAudit: handleAudit,
    onArrowUp: handleArrowUp,
    onArrowDown: handleArrowDown,
    onEnter: handleEnter,
    enabled: true,
  });

  return (
    <div className="min-h-screen bg-background sentinel-grid-bg">
      <DashboardHeader ref={searchRef} />

      <main className="p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Total Audited Volume"
            value="$4.2B"
            icon={DollarSign}
            variant="primary"
            subtitle="Last 30 days"
            trend={{ value: 12.4, isPositive: true }}
          />
          <KPICard
            title="Critical Flags"
            value="12"
            icon={AlertTriangle}
            variant="destructive"
            subtitle="Requires immediate attention"
            trend={{ value: 3, isPositive: false }}
          />
          <KPICard
            title="Compliance Health"
            value="94%"
            icon={ShieldCheck}
            variant="primary"
            subtitle="Across all departments"
            trend={{ value: 2.1, isPositive: true }}
          />
          <KPICard
            title="Avg. Detection Time"
            value="420ms"
            icon={Zap}
            variant="accent"
            subtitle="Real-time anomaly detection"
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Transaction Feed - Main Section */}
          <div className="lg:col-span-8">
            <div className="h-[500px]">
              <TransactionFeed
                transactions={mockTransactions}
                onTransactionClick={handleTransactionClick}
                selectedId={selectedTransaction?.id}
                focusedIndex={focusedIndex}
              />
            </div>
          </div>

          {/* AI Audit Sidebar */}
          <div className="lg:col-span-4">
            <div className="h-[500px]">
              <AuditSidebar />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="h-[300px]">
            <RiskTrendChart />
          </div>
          <div className="h-[300px]">
            <ComplianceChart />
          </div>
        </div>
      </main>

      {/* Transaction Detail Slide-over */}
      <TransactionDetail
        transaction={selectedTransaction}
        onClose={handleCloseDetail}
        isOpen={!!selectedTransaction}
      />
    </div>
  );
};

export default Index;
