import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Json } from "@/integrations/supabase/types";

export interface ThresholdSettings {
  highRiskScore: number;
  mediumRiskScore: number;
  maxTransactionAmount: number;
  velocityThreshold: number;
}

export interface NotificationSettings {
  criticalAlerts: boolean;
  flaggedTransactions: boolean;
  systemUpdates: boolean;
  emailDigest: boolean;
  digestFrequency: string;
  soundEnabled: boolean;
}

export interface DisplaySettings {
  transactionsPerPage: number;
  autoRefreshInterval: number;
  showRiskIndicators: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
}

export interface AllSettings {
  thresholds: ThresholdSettings;
  notifications: NotificationSettings;
  display: DisplaySettings;
}

const STORAGE_KEY = "sentinel-dashboard-settings";

export const defaultThresholds: ThresholdSettings = {
  highRiskScore: 70,
  mediumRiskScore: 40,
  maxTransactionAmount: 1000000,
  velocityThreshold: 10,
};

export const defaultNotifications: NotificationSettings = {
  criticalAlerts: true,
  flaggedTransactions: true,
  systemUpdates: false,
  emailDigest: true,
  digestFrequency: "daily",
  soundEnabled: true,
};

export const defaultDisplay: DisplaySettings = {
  transactionsPerPage: 50,
  autoRefreshInterval: 30,
  showRiskIndicators: true,
  compactMode: false,
  animationsEnabled: true,
};

const defaultSettings: AllSettings = {
  thresholds: defaultThresholds,
  notifications: defaultNotifications,
  display: defaultDisplay,
};

function loadLocalSettings(): AllSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        thresholds: { ...defaultThresholds, ...parsed.thresholds },
        notifications: { ...defaultNotifications, ...parsed.notifications },
        display: { ...defaultDisplay, ...parsed.display },
      };
    }
  } catch (error) {
    console.error("Failed to load settings from localStorage:", error);
  }
  return defaultSettings;
}

function saveLocalSettings(settings: AllSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
}

export function useSettings() {
  const [settings, setSettings] = useState<AllSettings>(loadLocalSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Check auth state and load settings from Supabase if authenticated
  useEffect(() => {
    const loadCloudSettings = async (uid: string) => {
      try {
        setIsSyncing(true);
        const { data, error } = await supabase
          .from("user_settings")
          .select("thresholds, notifications, display")
          .eq("user_id", uid)
          .maybeSingle();

        if (error) {
          console.error("Failed to load settings from Supabase:", error);
          return;
        }

        if (data) {
          const cloudSettings: AllSettings = {
            thresholds: { ...defaultThresholds, ...(data.thresholds as unknown as ThresholdSettings) },
            notifications: { ...defaultNotifications, ...(data.notifications as unknown as NotificationSettings) },
            display: { ...defaultDisplay, ...(data.display as unknown as DisplaySettings) },
          };
          setSettings(cloudSettings);
          saveLocalSettings(cloudSettings);
        } else {
          // No cloud settings exist, create them from local settings
          const localSettings = loadLocalSettings();
          await supabase.from("user_settings").insert([{
            user_id: uid,
            thresholds: localSettings.thresholds as unknown as Json,
            notifications: localSettings.notifications as unknown as Json,
            display: localSettings.display as unknown as Json,
          }]);
        }
      } catch (error) {
        console.error("Error syncing settings:", error);
      } finally {
        setIsSyncing(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const uid = session?.user?.id ?? null;
        setUserId(uid);
        if (uid) {
          loadCloudSettings(uid);
        }
      }
    );

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const uid = session?.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        loadCloudSettings(uid);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const updateThreshold = useCallback(<K extends keyof ThresholdSettings>(
    key: K,
    value: ThresholdSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      thresholds: { ...prev.thresholds, [key]: value },
    }));
    setHasChanges(true);
  }, []);

  const updateNotification = useCallback(<K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
    setHasChanges(true);
  }, []);

  const updateDisplay = useCallback(<K extends keyof DisplaySettings>(
    key: K,
    value: DisplaySettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      display: { ...prev.display, [key]: value },
    }));
    setHasChanges(true);
  }, []);

  const save = useCallback(async () => {
    // Always save to localStorage
    saveLocalSettings(settings);
    
    // If authenticated, also save to Supabase
    if (userId) {
      try {
        setIsSyncing(true);
        const { error } = await supabase
          .from("user_settings")
          .upsert([{
            user_id: userId,
            thresholds: settings.thresholds as unknown as Json,
            notifications: settings.notifications as unknown as Json,
            display: settings.display as unknown as Json,
          }], { onConflict: "user_id" });

        if (error) {
          console.error("Failed to save settings to Supabase:", error);
          toast.error("Failed to sync settings to cloud", {
            description: "Settings saved locally only",
          });
        } else {
          toast.success("Settings synced to cloud", {
            description: "Your preferences are now available on all devices",
          });
        }
      } catch (error) {
        console.error("Error saving to Supabase:", error);
      } finally {
        setIsSyncing(false);
      }
    }
    
    setHasChanges(false);
    return true;
  }, [settings, userId]);

  const reset = useCallback(async () => {
    setSettings(defaultSettings);
    saveLocalSettings(defaultSettings);
    
    // If authenticated, also reset in Supabase
    if (userId) {
      try {
        setIsSyncing(true);
        await supabase
          .from("user_settings")
          .upsert([{
            user_id: userId,
            thresholds: defaultSettings.thresholds as unknown as Json,
            notifications: defaultSettings.notifications as unknown as Json,
            display: defaultSettings.display as unknown as Json,
          }], { onConflict: "user_id" });
      } catch (error) {
        console.error("Error resetting settings in Supabase:", error);
      } finally {
        setIsSyncing(false);
      }
    }
    
    setHasChanges(false);
  }, [userId]);

  const reload = useCallback(() => {
    setSettings(loadLocalSettings());
    setHasChanges(false);
  }, []);

  return {
    thresholds: settings.thresholds,
    notifications: settings.notifications,
    display: settings.display,
    hasChanges,
    isSyncing,
    isAuthenticated: !!userId,
    updateThreshold,
    updateNotification,
    updateDisplay,
    save,
    reset,
    reload,
  };
}
