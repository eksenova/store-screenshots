"use client";

import { useState } from "react";
import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { exportPanel, exportAllAsZip, downloadBlob } from "@/lib/canvas/export";

export function ExportPanel() {
  const { state } = useEditor();
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const [quality, setQuality] = useState(0.95);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportSingle = async (index: number) => {
    setExporting(true);
    setError(null);
    try {
      const blob = await exportPanel(state, index, format, quality);
      const ext = format === "jpeg" ? "jpg" : "png";
      downloadBlob(blob, `screenshot_${index + 1}.${ext}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportZip = async () => {
    setExporting(true);
    setError(null);
    try {
      const blob = await exportAllAsZip(state, format, quality);
      downloadBlob(blob, "screenshots.zip");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("ZIP export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <CollapsibleSection title="Export">
      {/* Format */}
      <div className="flex gap-1">
        {(["png", "jpeg"] as const).map((f) => (
          <button key={f} onClick={() => setFormat(f)}
            className={`flex-1 px-2 py-1 text-xs rounded uppercase
              ${format === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            {f}
          </button>
        ))}
      </div>

      {format === "jpeg" && (
        <Slider label="Quality" value={quality} min={0.1} max={1} step={0.05}
          onChange={setQuality} />
      )}

      {/* Canvas dimensions info */}
      <div className="text-xs text-gray-500 space-y-0.5">
        {state.panels.map((panel, i) => (
          <div key={panel.id}>Panel {i + 1}: {panel.width} x {panel.height}px</div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">{error}</div>
      )}

      {/* Export buttons */}
      <div className="space-y-2">
        {state.panels.map((_, i) => (
          <Button key={i} variant="primary" size="md" className="w-full" disabled={exporting}
            onClick={() => handleExportSingle(i)}>
            {exporting ? "Exporting..." : state.panels.length > 1 ? `Export Panel ${i + 1}` : "Export PNG"}
          </Button>
        ))}
        {state.panels.length > 1 && (
          <Button variant="secondary" size="md" className="w-full" disabled={exporting}
            onClick={handleExportZip}>
            {exporting ? "Exporting..." : "Export All (ZIP)"}
          </Button>
        )}
      </div>
    </CollapsibleSection>
  );
}
