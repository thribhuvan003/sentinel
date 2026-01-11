import { forwardRef, useState } from "react";
import { Shield, Settings, Search, User, Keyboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPanel } from "./AdminPanel";
import { KeyboardShortcutsHelp } from "./KeyboardShortcutsHelp";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationsPanel } from "./NotificationsPanel";
import { SettingsPanel } from "./SettingsPanel";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  onSearchFocus?: () => void;
}

export const DashboardHeader = forwardRef<HTMLInputElement, DashboardHeaderProps>(
  ({ onSearchFocus }, ref) => {
    const [adminOpen, setAdminOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { user, signOut } = useAuth();

    const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'User';

    const handleAdminClick = () => {
      setAdminOpen(true);
    };

    const handleKeyboardShortcutsClick = () => {
      setShortcutsOpen(true);
    };

    const handleSettingsClick = () => {
      setSettingsOpen(true);
    };

    return (
      <>
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 sentinel-glow-primary">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">SENTINEL</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                  Enterprise Audit Platform
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  ref={ref}
                  placeholder="Search transactions, entities, or anomalies..."
                  className="pl-10 pr-16 bg-muted/50 border-border focus:border-primary/50 text-sm"
                  onFocus={onSearchFocus}
                />
                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono bg-muted border border-border rounded text-muted-foreground">
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <NotificationsPanel />
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSettingsClick}
                aria-label="Settings"
              >
                <Settings className="w-5 h-5 text-muted-foreground" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleKeyboardShortcutsClick}
                aria-label="Keyboard shortcuts"
              >
                <Keyboard className="w-5 h-5 text-muted-foreground" />
              </Button>
              <ThemeToggle />
              <div className="w-px h-6 bg-border mx-2" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm text-foreground">{displayName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleAdminClick}>
                    <User className="mr-2 h-4 w-4" />
                    Admin Panel
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <AdminPanel isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
        <KeyboardShortcutsHelp isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </>
    );
  }
);

DashboardHeader.displayName = "DashboardHeader";
