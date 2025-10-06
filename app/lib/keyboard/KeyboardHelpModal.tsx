import React from "react";
import { formatShortcutForDisplay } from "./utils";
import type { RegisteredShortcut } from "./types";

interface KeyboardHelpModalProps {
  shortcuts: RegisteredShortcut[];
}

export function KeyboardHelpModal({ shortcuts }: KeyboardHelpModalProps) {
  // Filter and sort shortcuts
  const filteredShortcuts = shortcuts
    .filter((s) => s.options.description)
    .sort((a, b) => {
      const scopeA = a.options.scope || "global";
      const scopeB = b.options.scope || "global";
      if (scopeA !== scopeB) {
        return scopeA.localeCompare(scopeB);
      }
      return a.keys.localeCompare(b.keys);
    });

  // Group by scope
  const grouped = filteredShortcuts.reduce(
    (acc, shortcut) => {
      const scope = shortcut.options.scope || "global";
      // ESLint doesn't realize acc[scope] can be defined from previous iterations
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!acc[scope]) {
        acc[scope] = [];
      }
      acc[scope].push(shortcut);
      return acc;
    },
    {} as Record<string, RegisteredShortcut[]>
  );

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([scope, items]) => (
        <div key={scope} className="mb-4">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-gray-500 mb-2">
            {scope === "global" ? "Global" : scope}
          </h3>
          <div className="space-y-1">
            {items.map((item, index) => (
              <div key={`${scope}-${index}`} className="flex justify-between items-center py-1">
                <span className="text-sm">{item.options.description}</span>
                <kbd className="ml-4 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded">
                  {formatShortcutForDisplay(item.keys)}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
