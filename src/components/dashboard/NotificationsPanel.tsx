import { forwardRef, useState, useEffect } from "react";
import { Bell, AlertTriangle, Flag, Info, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "critical" | "flag" | "system" | "success";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "critical",
    title: "High-Risk Transaction Detected",
    message: "Transaction #TXN-7842 from Apex Industries exceeds $2.5M threshold",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
  },
  {
    id: "2",
    type: "flag",
    title: "Duplicate Invoice Pattern",
    message: "3 potential duplicate invoices detected from Vendor #V-2891",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
  },
  {
    id: "3",
    type: "critical",
    title: "Velocity Spike Alert",
    message: "Unusual transaction frequency from Entity: Global Dynamics",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: false,
  },
  {
    id: "4",
    type: "system",
    title: "Audit Scan Complete",
    message: "Weekly compliance scan finished with 2 new findings",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Risk Resolution",
    message: "Flag #FL-1923 has been reviewed and cleared",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "6",
    type: "flag",
    title: "New Vendor Risk Assessment",
    message: "Pending review: Quantum Solutions Ltd requires verification",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: true,
  },
];

const getTimeAgo = (date: Date): string => {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const getIcon = (type: Notification["type"]) => {
  switch (type) {
    case "critical":
      return <AlertTriangle className="w-4 h-4 text-destructive" />;
    case "flag":
      return <Flag className="w-4 h-4 text-warning" />;
    case "system":
      return <Info className="w-4 h-4 text-accent" />;
    case "success":
      return <CheckCircle className="w-4 h-4 text-success" />;
  }
};

const getTypeStyles = (type: Notification["type"]) => {
  switch (type) {
    case "critical":
      return "border-l-destructive bg-destructive/5";
    case "flag":
      return "border-l-warning bg-warning/5";
    case "system":
      return "border-l-accent bg-accent/5";
    case "success":
      return "border-l-success bg-success/5";
  }
};

export const NotificationsPanel = forwardRef<HTMLButtonElement>((_, ref) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const types: Notification["type"][] = ["critical", "flag", "system"];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const messages = {
        critical: [
          { title: "Anomaly Detected", message: "Unusual pattern in recent transactions" },
          { title: "Threshold Breach", message: "Daily limit exceeded for vendor account" },
        ],
        flag: [
          { title: "Review Required", message: "Transaction pending manual verification" },
          { title: "Pattern Match", message: "Similar transaction flagged previously" },
        ],
        system: [
          { title: "Model Updated", message: "Risk assessment model refreshed" },
          { title: "Sync Complete", message: "All systems synchronized successfully" },
        ],
      };
      
      const typeMessages = messages[randomType];
      const randomMessage = typeMessages[Math.floor(Math.random() * typeMessages.length)];
      
      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          type: randomType,
          ...randomMessage,
          timestamp: new Date(),
          read: false,
        },
        ...prev.slice(0, 19), // Keep max 20 notifications
      ]);
    }, 30000); // New notification every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          ref={ref}
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[380px] p-0 bg-popover border-border"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-destructive/10 text-destructive rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "relative px-4 py-3 border-l-2 transition-colors cursor-pointer hover:bg-muted/50",
                    getTypeStyles(notification.type),
                    !notification.read && "bg-muted/30"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3 pr-6">
                    <div className="mt-0.5">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn(
                          "text-sm truncate",
                          !notification.read ? "font-semibold text-foreground" : "text-foreground/80"
                        )}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1 font-mono">
                        {getTimeAgo(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <button
                    className="absolute top-3 right-3 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notification.id);
                    }}
                    aria-label="Dismiss notification"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});

NotificationsPanel.displayName = "NotificationsPanel";
