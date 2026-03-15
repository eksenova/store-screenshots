"use client";

import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Toggle } from "@/components/ui/Toggle";

export function SplitScreenPanel() {
  const { state, dispatch } = useEditor();

  return (
    <CollapsibleSection title="Split Screen" defaultOpen={false}>
      <Toggle
        label="Enable split screen"
        checked={state.mode === "split-horizontal"}
        onChange={(checked) =>
          dispatch({ type: "SET_SPLIT_MODE", mode: checked ? "split-horizontal" : "single" })
        }
      />
      {state.mode === "split-horizontal" && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">
            Two panels side by side. Layers can span across both panels.
          </p>
          <div className="flex gap-1">
            {state.panels.map((panel, i) => (
              <button
                key={panel.id}
                onClick={() => dispatch({ type: "SELECT_PANEL", panelId: panel.id })}
                className={`flex-1 px-2 py-1.5 text-xs rounded
                  ${state.selectedPanelId === panel.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                Panel {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}
