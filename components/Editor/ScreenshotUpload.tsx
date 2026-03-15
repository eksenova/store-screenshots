"use client";

import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { ImageDropzone } from "@/components/Upload/ImageDropzone";
import { loadImage } from "@/lib/canvas/image-cache";
import type { DeviceMockupLayer } from "@/lib/types";

export function ScreenshotUpload() {
  const { activePanel, selectedLayer, setScreenshot, selectLayer } = useEditor();

  const deviceLayers = activePanel.layers.filter(
    (l) => l.type === "device-mockup",
  ) as DeviceMockupLayer[];

  const selectedDevice =
    selectedLayer?.type === "device-mockup" ? (selectedLayer as DeviceMockupLayer) : null;

  // No device mockups — block upload entirely
  if (deviceLayers.length === 0) {
    return (
      <CollapsibleSection title="Screenshot">
        <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-3 py-4 text-center">
          <p className="text-xs text-gray-400">Add a device mockup first</p>
          <p className="text-[10px] text-gray-300 mt-1">Use the Devices panel above</p>
        </div>
      </CollapsibleSection>
    );
  }

  const handleImageUpload = async (src: string, targetLayerId: string) => {
    await loadImage(src);
    setScreenshot(targetLayerId, src);
    selectLayer(targetLayerId);
  };

  // Determine the target device for the main upload area
  const uploadTarget = selectedDevice ?? deviceLayers.find((l) => !l.screenshotSrc) ?? deviceLayers[0];

  return (
    <CollapsibleSection title="Screenshot">
      {/* Main upload — always targets a specific device */}
      <ImageDropzone
        label={`Upload to: ${uploadTarget.name}`}
        onImageLoad={(src) => handleImageUpload(src, uploadTarget.id)}
      />

      {/* Per-device list */}
      {deviceLayers.length > 1 && (
        <div className="space-y-2 mt-2">
          <div className="text-xs font-medium text-gray-600">All devices:</div>
          {deviceLayers.map((layer) => (
            <div
              key={layer.id}
              className={`rounded-lg border p-2 cursor-pointer transition-colors
                ${selectedLayer?.id === layer.id
                  ? "border-indigo-300 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => selectLayer(layer.id)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-gray-700 truncate">{layer.name}</span>
                {layer.screenshotSrc && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setScreenshot(layer.id, null);
                    }}
                    className="text-[10px] text-red-400 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>

              {layer.screenshotSrc ? (
                <div className="relative group">
                  <img
                    src={layer.screenshotSrc}
                    alt="Screenshot"
                    className="w-full h-16 object-cover rounded border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                    <label className="px-2 py-1 bg-white text-gray-700 rounded text-[10px] cursor-pointer hover:bg-gray-100">
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => handleImageUpload(ev.target?.result as string, layer.id);
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <ImageDropzone
                  compact
                  label="Drop screenshot here"
                  onImageLoad={(src) => handleImageUpload(src, layer.id)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}
