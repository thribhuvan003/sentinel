import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Users, Shield, Clock, Activity, Key, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const accessLogs = [
  { user: "admin@sentinel.io", action: "Viewed transaction #TXN-2024-8892", time: "2 min ago" },
  { user: "analyst@sentinel.io", action: "Exported compliance report", time: "15 min ago" },
  { user: "admin@sentinel.io", action: "Modified RLS policy", time: "1 hour ago" },
  { user: "viewer@sentinel.io", action: "Accessed dashboard", time: "2 hours ago" },
];

const stats = [
  { label: "Active Users", value: "12", icon: Users },
  { label: "Sessions Today", value: "47", icon: Activity },
  { label: "Avg. Session", value: "24m", icon: Clock },
  { label: "API Calls", value: "1.2K", icon: Key },
];

export const AdminPanel = forwardRef<HTMLDivElement, AdminPanelProps>(
  ({ isOpen, onClose }, ref) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
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
                    <div className="p-2 rounded-lg bg-accent/10">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Admin Panel</h2>
                      <p className="text-xs text-muted-foreground">System overview & access logs</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto sentinel-scrollbar p-6 space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="p-4 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <stat.icon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold font-mono text-foreground">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Access Logs */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      Recent Access Logs
                    </h3>
                    <div className="space-y-2">
                      {accessLogs.map((log, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 rounded-lg bg-muted/30 border border-border/50"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">
                                {log.user}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {log.action}
                              </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {log.time}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Permissions */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Key className="w-4 h-4 text-muted-foreground" />
                      Your Permissions
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {["View Dashboard", "Run Audits", "Export Reports", "Manage Users", "System Config"].map(
                        (perm) => (
                          <span
                            key={perm}
                            className="px-2 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20"
                          >
                            {perm}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/20">
                  <p className="text-xs text-muted-foreground text-center">
                    Sentinel Admin v2.4 • Last sync: Just now
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

AdminPanel.displayName = "AdminPanel";
