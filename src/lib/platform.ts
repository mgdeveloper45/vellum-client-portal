export function getKeyboardShortcutLabel() {
  if (typeof navigator === "undefined") {
    return "⌘K";
  }

  return navigator.platform.toUpperCase().includes("MAC") ? "⌘K" : "Ctrl K";
}