import { useEffect, useCallback } from "react";
import { toast } from "sonner";

interface KeyboardShortcutsConfig {
  onEscape?: () => void;
  onSearch?: () => void;
  onAudit?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onEnter?: () => void;
  enabled?: boolean;
}

export function useKeyboardShortcuts({
  onEscape,
  onSearch,
  onAudit,
  onArrowUp,
  onArrowDown,
  onEnter,
  enabled = true,
}: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Escape - always works
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      // Cmd/Ctrl + K - focus search (works even in inputs)
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        onSearch?.();
        return;
      }

      // Cmd/Ctrl + A - trigger audit (prevent default select all)
      if ((event.metaKey || event.ctrlKey) && event.key === "a" && !isInputFocused) {
        event.preventDefault();
        onAudit?.();
        return;
      }

      // Arrow keys and Enter - only when not in input
      if (!isInputFocused) {
        if (event.key === "ArrowUp") {
          event.preventDefault();
          onArrowUp?.();
          return;
        }

        if (event.key === "ArrowDown") {
          event.preventDefault();
          onArrowDown?.();
          return;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          onEnter?.();
          return;
        }
      }
    },
    [enabled, onEscape, onSearch, onAudit, onArrowUp, onArrowDown, onEnter]
  );

  useEffect(() => {
    // Add global event listener for keyboard shortcuts
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      // Cleanup: remove event listener on unmount
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}

// Keyboard shortcut display helper
export const shortcutKeys = {
  search: "⌘K",
  audit: "⌘A",
  escape: "Esc",
  navigate: "↑↓",
  select: "Enter",
};
