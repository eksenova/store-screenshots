"use client";

import { useState, useCallback } from "react";
import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Button } from "@/components/ui/Button";
import { NumberInput } from "@/components/ui/NumberInput";
import { loadMockupFile, createCustomDevice, saveCustomMockups, loadCustomMockups, deleteCustomMockup } from "@/lib/mockup-manager";
import { loadImage } from "@/lib/canvas/image-cache";
import type { CustomMockup } from "@/lib/mockup-manager";

type UploadStep = "idle" | "loaded" | "configure";

interface UploadedFrame {
  dataUrl: string;
  width: number;
  height: number;
  format: "svg" | "png" | "psd";
  fileName: string;
}

export function CustomMockupUpload() {
  const { dispatch, activePanel } = useEditor();
  const [step, setStep] = useState<UploadStep>("idle");
  const [frame, setFrame] = useState<UploadedFrame | null>(null);
  const [name, setName] = useState("");
  const [screenRegion, setScreenRegion] = useState({ x: 40, y: 40, width: 0, height: 0 });
  const [customMockups, setCustomMockups] = useState<CustomMockup[]>(() => loadCustomMockups());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loadMockupFile(file);
      setFrame({
        dataUrl: result.dataUrl,
        width: result.width,
        height: result.height,
        format: result.format,
        fileName: file.name,
      });
      setName(file.name.replace(/\.[^.]+$/, ""));
      setScreenRegion({
        x: Math.round(result.width * 0.03),
        y: Math.round(result.height * 0.015),
        width: Math.round(result.width * 0.94),
        height: Math.round(result.height * 0.97),
      });
      setStep("configure");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load file");
    } finally {
      setLoading(false);
    }

    e.target.value = "";
  }, []);

  const handleSave = useCallback(async () => {
    if (!frame) return;

    const device = createCustomDevice(
      name || "Custom Mockup",
      frame.dataUrl,
      frame.width,
      frame.height,
      frame.format,
      screenRegion,
    );

    // Pre-cache the frame image
    await loadImage(frame.dataUrl);

    const updated = [...customMockups, device];
    saveCustomMockups(updated);
    setCustomMockups(updated);
    setStep("idle");
    setFrame(null);

    // Add to canvas as a new layer
    dispatch({
      type: "ADD_DEVICE_MOCKUP",
      panelId: activePanel.id,
      deviceId: device.id,
    });
  }, [frame, name, screenRegion, customMockups, dispatch, activePanel.id]);

  const handleDelete = useCallback((id: string) => {
    deleteCustomMockup(id);
    setCustomMockups((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return (
    <CollapsibleSection title="Custom Mockups" defaultOpen={false}>
      <p className="text-xs text-gray-500 mb-2">
        Upload PNG, PSD, or SVG device mockup files
      </p>

      {/* Upload button */}
      {step === "idle" && (
        <label className="block">
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.webp,.psd,.svg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="border-2 border-dashed border-gray-300 rounded-lg px-3 py-4 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
            <p className="text-xs text-gray-500">
              {loading ? "Loading..." : "Click to upload mockup (PNG / PSD / SVG)"}
            </p>
          </div>
        </label>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Configure screen region */}
      {step === "configure" && frame && (
        <div className="space-y-3">
          <div className="relative border rounded overflow-hidden">
            <img src={frame.dataUrl} alt="Mockup preview" className="w-full" />
            {/* Screen region overlay */}
            <div
              className="absolute border-2 border-indigo-500 bg-indigo-500/10"
              style={{
                left: `${(screenRegion.x / frame.width) * 100}%`,
                top: `${(screenRegion.y / frame.height) * 100}%`,
                width: `${(screenRegion.width / frame.width) * 100}%`,
                height: `${(screenRegion.height / frame.height) * 100}%`,
              }}
            />
          </div>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mockup name"
            className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
          />

          <div className="text-xs text-gray-500">
            Frame: {frame.width}x{frame.height}px ({frame.format.toUpperCase()})
          </div>

          <div className="text-xs font-medium text-gray-600">Screen region:</div>
          <div className="grid grid-cols-2 gap-2">
            <NumberInput label="X" value={screenRegion.x} min={0} max={frame.width}
              onChange={(x) => setScreenRegion((r) => ({ ...r, x }))} />
            <NumberInput label="Y" value={screenRegion.y} min={0} max={frame.height}
              onChange={(y) => setScreenRegion((r) => ({ ...r, y }))} />
            <NumberInput label="W" value={screenRegion.width} min={1} max={frame.width}
              onChange={(width) => setScreenRegion((r) => ({ ...r, width }))} />
            <NumberInput label="H" value={screenRegion.height} min={1} max={frame.height}
              onChange={(height) => setScreenRegion((r) => ({ ...r, height }))} />
          </div>

          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave} className="flex-1">
              Save Mockup
            </Button>
            <Button size="sm" onClick={() => { setStep("idle"); setFrame(null); }}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Saved custom mockups */}
      {customMockups.length > 0 && (
        <div className="space-y-1 mt-2">
          <div className="text-xs font-medium text-gray-600">Saved mockups:</div>
          {customMockups.map((m) => (
            <div key={m.id} className="flex items-center gap-2 rounded bg-gray-50 px-2 py-1">
              <span className="text-xs text-gray-700 flex-1 truncate">{m.name}</span>
              <span className="text-[10px] text-gray-400">{m.frameWidth}x{m.frameHeight}</span>
              <button
                onClick={() => handleDelete(m.id)}
                className="text-xs text-red-400 hover:text-red-600"
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
