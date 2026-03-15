"use client";

import { useState, useCallback } from "react";
import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Button } from "@/components/ui/Button";
import {
  BUILT_IN_TEMPLATES,
  saveTemplate,
  loadSavedTemplates,
  deleteTemplate,
  exportTemplateAsJson,
  importTemplateFromJson,
  type Template,
} from "@/lib/templates";

export function TemplatePanel() {
  const { state, dispatch } = useEditor();
  const [savedTemplates, setSavedTemplates] = useState<Template[]>(() => loadSavedTemplates());
  const [saveName, setSaveName] = useState("");
  const [showSave, setShowSave] = useState(false);

  const applyTemplate = useCallback(
    (template: Omit<Template, "id" | "createdAt"> | Template) => {
      dispatch({ type: "LOAD_PROJECT", state: JSON.parse(JSON.stringify(template.state)) });
    },
    [dispatch],
  );

  const handleSave = useCallback(() => {
    if (!saveName.trim()) return;
    const template = saveTemplate(saveName.trim(), "Custom", state);
    setSavedTemplates((prev) => [...prev, template]);
    setSaveName("");
    setShowSave(false);
  }, [saveName, state]);

  const handleDelete = useCallback((id: string) => {
    deleteTemplate(id);
    setSavedTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleExport = useCallback((template: Template) => {
    const json = exportTemplateAsJson(template);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, "-").toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const json = await file.text();
        const template = importTemplateFromJson(json);
        const saved = saveTemplate(template.name, template.category || "Imported", template.state);
        setSavedTemplates((prev) => [...prev, saved]);
      } catch {
        alert("Invalid template file");
      }
    };
    input.click();
  }, []);

  return (
    <CollapsibleSection title="Templates" defaultOpen={false}>
      {/* Built-in presets */}
      <div className="text-xs font-medium text-gray-600 mb-1">Presets</div>
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {BUILT_IN_TEMPLATES.map((t, i) => {
          const bg = t.state.panels[0]?.background;
          const bgStyle = bg?.type === "solid"
            ? { backgroundColor: bg.color }
            : bg?.type === "linear"
              ? { background: `linear-gradient(${bg.angle}deg, ${bg.stops.map((s) => `${s.color} ${s.position * 100}%`).join(", ")})` }
              : {};

          return (
            <button
              key={i}
              onClick={() => applyTemplate(t)}
              className="rounded-md border border-gray-200 p-1 hover:border-indigo-400 transition-colors"
              title={t.name}
            >
              <div className="h-12 rounded" style={bgStyle} />
              <div className="text-[9px] text-gray-500 mt-0.5 truncate">{t.name}</div>
            </button>
          );
        })}
      </div>

      {/* Save current */}
      {showSave ? (
        <div className="flex gap-1 mb-2">
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Template name..."
            className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
          />
          <Button size="sm" variant="primary" onClick={handleSave}>Save</Button>
          <Button size="sm" onClick={() => setShowSave(false)}>x</Button>
        </div>
      ) : (
        <div className="flex gap-1 mb-2">
          <Button size="sm" className="flex-1" onClick={() => setShowSave(true)}>
            Save Current
          </Button>
          <Button size="sm" onClick={handleImport}>Import</Button>
        </div>
      )}

      {/* Saved templates */}
      {savedTemplates.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-600">Saved</div>
          {savedTemplates.map((t) => (
            <div key={t.id} className="flex items-center gap-1 rounded bg-gray-50 px-2 py-1">
              <button
                onClick={() => applyTemplate(t)}
                className="text-xs text-gray-700 flex-1 text-left truncate hover:text-indigo-600"
              >
                {t.name}
              </button>
              <button
                onClick={() => handleExport(t)}
                className="text-[10px] text-gray-400 hover:text-gray-600"
                title="Export JSON"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-[10px] text-red-400 hover:text-red-600"
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}
