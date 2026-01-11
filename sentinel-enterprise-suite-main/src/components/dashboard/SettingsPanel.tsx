import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Settings, AlertTriangle, Bell, Monitor, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = forwardRef<HTMLDivElement, SettingsPanelProps>(
  ({ isOpen, onClose }, ref) => {
    const {
      thresholds,
      notifications,
      display,
      hasChanges,
      updateThreshold,
      updateNotification,
      updateDisplay,
      save,
      reset,
    } = useSettings();

    const handleSave = () => {
      save();
      toast.success("Settings saved successfully", {
        description: "Your preferences have been updated and will persist across sessions",
      });
    };

    const handleReset = () => {
      reset();
      toast.info("Settings reset to defaults");
    };

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
              className="fixed inset-y-0 right-0 w-full max-w-lg z-50"
            >
              <div className="h-full bg-card border-l border-border shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Settings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Settings</h2>
                      <p className="text-xs text-muted-foreground">Configure dashboard preferences</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto sentinel-scrollbar">
                  <Tabs defaultValue="thresholds" className="w-full">
                    <div className="px-6 pt-4 border-b border-border">
                      <TabsList className="w-full grid grid-cols-3 bg-muted/50">
                        <TabsTrigger value="thresholds" className="text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                          Thresholds
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="text-xs">
                          <Bell className="w-3.5 h-3.5 mr-1.5" />
                          Notifications
                        </TabsTrigger>
                        <TabsTrigger value="display" className="text-xs">
                          <Monitor className="w-3.5 h-3.5 mr-1.5" />
                          Display
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Thresholds Tab */}
                    <TabsContent value="thresholds" className="p-6 space-y-6 mt-0">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">High Risk Score Threshold</Label>
                            <span className="text-sm font-mono text-destructive">
                              {thresholds.highRiskScore}+
                            </span>
                          </div>
                          <Slider
                            value={[thresholds.highRiskScore]}
                            onValueChange={([v]) => updateThreshold("highRiskScore", v)}
                            min={50}
                            max={100}
                            step={5}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            Transactions at or above this score trigger critical alerts
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Medium Risk Score Threshold</Label>
                            <span className="text-sm font-mono text-warning">
                              {thresholds.mediumRiskScore}+
                            </span>
                          </div>
                          <Slider
                            value={[thresholds.mediumRiskScore]}
                            onValueChange={([v]) => updateThreshold("mediumRiskScore", v)}
                            min={20}
                            max={thresholds.highRiskScore - 10}
                            step={5}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            Transactions between this and high threshold are flagged for review
                          </p>
                        </div>

                        <div className="space-y-3 pt-2">
                          <Label className="text-sm">Maximum Transaction Amount ($)</Label>
                          <Input
                            type="number"
                            value={thresholds.maxTransactionAmount}
                            onChange={(e) =>
                              updateThreshold("maxTransactionAmount", Number(e.target.value))
                            }
                            className="font-mono"
                          />
                          <p className="text-xs text-muted-foreground">
                            Transactions exceeding this amount require additional review
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Velocity Threshold (per hour)</Label>
                            <span className="text-sm font-mono text-accent">
                              {thresholds.velocityThreshold}
                            </span>
                          </div>
                          <Slider
                            value={[thresholds.velocityThreshold]}
                            onValueChange={([v]) => updateThreshold("velocityThreshold", v)}
                            min={3}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            Alert when entity exceeds this many transactions per hour
                          </p>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="p-6 space-y-6 mt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Critical Alerts</Label>
                            <p className="text-xs text-muted-foreground">
                              High-risk transactions and anomalies
                            </p>
                          </div>
                          <Switch
                            checked={notifications.criticalAlerts}
                            onCheckedChange={(v) => updateNotification("criticalAlerts", v)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Flagged Transactions</Label>
                            <p className="text-xs text-muted-foreground">
                              Items pending manual review
                            </p>
                          </div>
                          <Switch
                            checked={notifications.flaggedTransactions}
                            onCheckedChange={(v) => updateNotification("flaggedTransactions", v)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">System Updates</Label>
                            <p className="text-xs text-muted-foreground">
                              Model updates, sync status, maintenance
                            </p>
                          </div>
                          <Switch
                            checked={notifications.systemUpdates}
                            onCheckedChange={(v) => updateNotification("systemUpdates", v)}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label className="text-sm">Sound Effects</Label>
                            <p className="text-xs text-muted-foreground">
                              Play sound for new notifications
                            </p>
                          </div>
                          <Switch
                            checked={notifications.soundEnabled}
                            onCheckedChange={(v) => updateNotification("soundEnabled", v)}
                          />
                        </div>

                        <div className="pt-4 border-t border-border space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Email Digest</Label>
                              <p className="text-xs text-muted-foreground">
                                Receive summary emails
                              </p>
                            </div>
                            <Switch
                              checked={notifications.emailDigest}
                              onCheckedChange={(v) => updateNotification("emailDigest", v)}
                            />
                          </div>

                          {notifications.emailDigest && (
                            <div className="space-y-2">
                              <Label className="text-sm">Digest Frequency</Label>
                              <Select
                                value={notifications.digestFrequency}
                                onValueChange={(v) => updateNotification("digestFrequency", v)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="hourly">Hourly</SelectItem>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </TabsContent>

                    {/* Display Tab */}
                    <TabsContent value="display" className="p-6 space-y-6 mt-0">
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <Label className="text-sm">Transactions Per Page</Label>
                          <Select
                            value={String(display.transactionsPerPage)}
                            onValueChange={(v) => updateDisplay("transactionsPerPage", Number(v))}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="25">25 transactions</SelectItem>
                              <SelectItem value="50">50 transactions</SelectItem>
                              <SelectItem value="100">100 transactions</SelectItem>
                              <SelectItem value="200">200 transactions</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm">Auto-Refresh Interval</Label>
                            <span className="text-sm font-mono text-muted-foreground">
                              {display.autoRefreshInterval}s
                            </span>
                          </div>
                          <Slider
                            value={[display.autoRefreshInterval]}
                            onValueChange={([v]) => updateDisplay("autoRefreshInterval", v)}
                            min={10}
                            max={120}
                            step={10}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground">
                            How often the transaction feed refreshes
                          </p>
                        </div>

                        <div className="pt-4 border-t border-border space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Show Risk Indicators</Label>
                              <p className="text-xs text-muted-foreground">
                                Color-coded risk badges in feed
                              </p>
                            </div>
                            <Switch
                              checked={display.showRiskIndicators}
                              onCheckedChange={(v) => updateDisplay("showRiskIndicators", v)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Compact Mode</Label>
                              <p className="text-xs text-muted-foreground">
                                Reduce spacing for more data
                              </p>
                            </div>
                            <Switch
                              checked={display.compactMode}
                              onCheckedChange={(v) => updateDisplay("compactMode", v)}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label className="text-sm">Animations</Label>
                              <p className="text-xs text-muted-foreground">
                                Enable UI transitions and effects
                              </p>
                            </div>
                            <Switch
                              checked={display.animationsEnabled}
                              onCheckedChange={(v) => updateDisplay("animationsEnabled", v)}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!hasChanges}
                    className="gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
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

SettingsPanel.displayName = "SettingsPanel";
