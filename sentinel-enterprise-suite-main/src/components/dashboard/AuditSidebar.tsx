import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Brain, Play, CheckCircle, AlertTriangle, FileSearch, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnomalyResult {
  id: string;
  type: string;
  severity: "critical" | "warning" | "info";
  description: string;
  affectedCount: number;
}

const mockAnomalies: AnomalyResult[] = [
  { id: "1", type: "Duplicate Invoice", severity: "critical", description: "Invoice #INV-2024-8892 appears 3 times across vendors", affectedCount: 3 },
  { id: "2", type: "High-Value Outlier", severity: "critical", description: "Transaction exceeds 400% of vendor baseline", affectedCount: 1 },
  { id: "3", type: "Velocity Spike", severity: "warning", description: "15 transactions in 2-minute window from single source", affectedCount: 15 },
  { id: "4", type: "Round Number Pattern", severity: "warning", description: "Suspicious clustering of $X,000 transactions", affectedCount: 7 },
  { id: "5", type: "New Vendor Risk", severity: "info", description: "3 new vendors added without standard vetting", affectedCount: 3 },
];

export function AuditSidebar() {
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanPhase, setScanPhase] = useState("");
  const [results, setResults] = useState<AnomalyResult[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  const phases = [
    "Initializing neural network...",
    "Loading transaction patterns...",
    "Analyzing vendor relationships...",
    "Detecting statistical anomalies...",
    "Cross-referencing historical data...",
    "Generating risk assessments...",
    "Compiling results...",
  ];

  const runAudit = () => {
    setIsScanning(true);
    setProgress(0);
    setResults([]);
    setScanComplete(false);

    let currentProgress = 0;
    let phaseIndex = 0;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 8 + 2;
      phaseIndex = Math.min(Math.floor(currentProgress / 15), phases.length - 1);
      
      setScanPhase(phases[phaseIndex]);
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanComplete(true);
        
        // Reveal results one by one
        mockAnomalies.forEach((anomaly, index) => {
          setTimeout(() => {
            setResults((prev) => [...prev, anomaly]);
          }, index * 300);
        });
      }
    }, 200);
  };

  const severityConfig = {
    critical: { icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20" },
    warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20" },
    info: { icon: FileSearch, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" },
  };

  return (
    <div className="sentinel-card-elevated h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">AI Audit Engine</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Neural network-powered anomaly detection
        </p>
      </div>

      {/* Scan Controls */}
      <div className="p-4 border-b border-border">
        <Button
          onClick={runAudit}
          disabled={isScanning}
          data-audit-button
          className={cn(
            "w-full gap-2",
            !isScanning && "bg-accent hover:bg-accent/90 text-accent-foreground"
          )}
        >
          {isScanning ? (
            <>
              <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Audit
            </>
          )}
        </Button>

        {/* Progress Section */}
        {(isScanning || scanComplete) && (
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                {isScanning ? scanPhase : "Scan complete"}
              </p>
              <span className="text-xs font-mono text-primary tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto sentinel-scrollbar p-4 space-y-3">
        {!scanComplete && !isScanning && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Shield className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-sm text-muted-foreground">
              Run an audit to detect anomalies and potential compliance issues
            </p>
          </div>
        )}

        {results.map((anomaly) => {
          const config = severityConfig[anomaly.severity];
          const Icon = config.icon;

          return (
            <div
              key={anomaly.id}
              className={cn(
                "p-3 rounded-lg border animate-fade-in",
                config.bg,
                config.border
              )}
            >
              <div className="flex items-start gap-2">
                <Icon className={cn("w-4 h-4 mt-0.5 flex-shrink-0", config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("text-sm font-medium", config.color)}>
                      {anomaly.type}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {anomaly.affectedCount}x
                    </span>
                  </div>
                  <p className="text-xs text-foreground/80 mt-1">
                    {anomaly.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {scanComplete && results.length === mockAnomalies.length && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20 mt-4">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              Scan complete: {results.length} anomalies detected
            </span>
          </div>
        )}
      </div>

      {/* Stats Footer */}
      <div className="px-4 py-3 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Last scan</span>
          <span className="font-mono text-foreground">
            {scanComplete ? "Just now" : "2 hours ago"}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1">
          <Zap className="w-3 h-3 text-accent" />
          <span className="text-xs text-muted-foreground">Powered by Sentinel AI v2.4</span>
        </div>
      </div>
    </div>
  );
}
