"use client";

import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Slider } from "@/components/ui/Slider";
import { ImageDropzone } from "@/components/Upload/ImageDropzone";
import type { Background, GradientStop } from "@/lib/types";

export function BackgroundPanel() {
  const { activePanel, setBackground } = useEditor();
  const bg = activePanel.background;

  const setType = (type: Background["type"]) => {
    switch (type) {
      case "solid":
        setBackground({ type: "solid", color: "#6366F1" });
        break;
      case "linear":
        setBackground({
          type: "linear",
          angle: 135,
          stops: [
            { color: "#6366F1", position: 0 },
            { color: "#EC4899", position: 1 },
          ],
        });
        break;
      case "radial":
        setBackground({
          type: "radial",
          centerX: 0.5,
          centerY: 0.5,
          stops: [
            { color: "#6366F1", position: 0 },
            { color: "#1E1B4B", position: 1 },
          ],
        });
        break;
      case "image":
        setBackground({ type: "image", src: "", fit: "cover" });
        break;
    }
  };

  const updateStop = (index: number, changes: Partial<GradientStop>) => {
    if (bg.type !== "linear" && bg.type !== "radial") return;
    const stops = bg.stops.map((s, i) => (i === index ? { ...s, ...changes } : s));
    setBackground({ ...bg, stops } as Background);
  };

  const addStop = () => {
    if (bg.type !== "linear" && bg.type !== "radial") return;
    const stops = [...bg.stops, { color: "#FFFFFF", position: 0.5 }];
    setBackground({ ...bg, stops } as Background);
  };

  const removeStop = (index: number) => {
    if (bg.type !== "linear" && bg.type !== "radial") return;
    if (bg.stops.length <= 2) return;
    const stops = bg.stops.filter((_, i) => i !== index);
    setBackground({ ...bg, stops } as Background);
  };

  return (
    <CollapsibleSection title="Background">
      {/* Type selector */}
      <div className="flex gap-1">
        {(["solid", "linear", "radial", "image"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`flex-1 px-1 py-1 text-xs rounded capitalize transition-colors
              ${bg.type === t ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Solid color */}
      {bg.type === "solid" && (
        <ColorPicker label="Color" value={bg.color} onChange={(color) => setBackground({ type: "solid", color })} />
      )}

      {/* Linear gradient */}
      {bg.type === "linear" && (
        <>
          <Slider label="Angle" value={bg.angle} min={0} max={360} unit="°"
            onChange={(angle) => setBackground({ ...bg, angle })} />
          <GradientStops stops={bg.stops} onUpdate={updateStop} onAdd={addStop} onRemove={removeStop} />
        </>
      )}

      {/* Radial gradient */}
      {bg.type === "radial" && (
        <>
          <Slider label="Center X" value={bg.centerX} min={0} max={1} step={0.01}
            onChange={(centerX) => setBackground({ ...bg, centerX })} />
          <Slider label="Center Y" value={bg.centerY} min={0} max={1} step={0.01}
            onChange={(centerY) => setBackground({ ...bg, centerY })} />
          <GradientStops stops={bg.stops} onUpdate={updateStop} onAdd={addStop} onRemove={removeStop} />
        </>
      )}

      {/* Image background */}
      {bg.type === "image" && (
        <>
          <ImageDropzone
            compact
            label="Upload background image"
            onImageLoad={(src) => setBackground({ ...bg, src })}
          />
          <div className="flex gap-1">
            {(["cover", "contain", "stretch", "tile"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setBackground({ ...bg, fit: f })}
                className={`flex-1 px-1 py-1 text-xs rounded capitalize
                  ${bg.fit === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </>
      )}
    </CollapsibleSection>
  );
}

function GradientStops({
  stops,
  onUpdate,
  onAdd,
  onRemove,
}: {
  stops: GradientStop[];
  onUpdate: (i: number, changes: Partial<GradientStop>) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div className="space-y-2">
      {stops.map((stop, i) => (
        <div key={i} className="flex items-center gap-2">
          <ColorPicker value={stop.color} onChange={(color) => onUpdate(i, { color })} />
          <input
            type="number"
            value={Math.round(stop.position * 100)}
            min={0}
            max={100}
            onChange={(e) => onUpdate(i, { position: Number(e.target.value) / 100 })}
            className="w-12 rounded border border-gray-300 px-1 py-0.5 text-xs font-mono"
          />
          <span className="text-xs text-gray-400">%</span>
          {stops.length > 2 && (
            <button onClick={() => onRemove(i)} className="text-red-400 hover:text-red-600 text-xs">x</button>
          )}
        </div>
      ))}
      <button onClick={onAdd} className="text-xs text-indigo-600 hover:text-indigo-800">+ Add stop</button>
    </div>
  );
}
