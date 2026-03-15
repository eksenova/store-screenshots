"use client";

import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { ColorPicker } from "@/components/ui/ColorPicker";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";
import { FontPicker } from "./FontPicker";
import type { TextLayer } from "@/lib/types";

export function TextPanel() {
  const { selectedLayer, setText, activePanel } = useEditor();

  if (!selectedLayer || selectedLayer.type !== "text") {
    return (
      <CollapsibleSection title="Text">
        <p className="text-xs text-gray-400">Select a text layer to edit</p>
      </CollapsibleSection>
    );
  }

  const layer = selectedLayer as TextLayer;
  const { text } = layer;

  const update = (changes: Partial<typeof text>) => setText(layer.id, changes);

  return (
    <CollapsibleSection title="Text">
      {/* Content */}
      <textarea
        value={text.content}
        onChange={(e) => update({ content: e.target.value })}
        rows={3}
        className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm resize-none"
        placeholder="Enter text..."
      />

      {/* Font family */}
      <FontPicker value={text.fontFamily} onChange={(fontFamily) => update({ fontFamily })} />

      {/* Font size & weight */}
      <div className="grid grid-cols-2 gap-2">
        <Slider label="Size" value={text.fontSize} min={12} max={200} unit="px"
          onChange={(fontSize) => update({ fontSize })} />
        <Slider label="Weight" value={text.fontWeight} min={100} max={900} step={100}
          onChange={(fontWeight) => update({ fontWeight })} />
      </div>

      {/* Color */}
      <ColorPicker label="Color" value={text.color} onChange={(color) => update({ color })} />

      {/* Text gradient */}
      <Toggle
        label="Text gradient"
        checked={!!text.gradient}
        onChange={(checked) =>
          update({
            gradient: checked
              ? { type: "linear", angle: 90, stops: [{ color: "#6366F1", position: 0 }, { color: "#EC4899", position: 1 }] }
              : null,
          })
        }
      />
      {text.gradient && (
        <div className="flex items-center gap-2">
          <ColorPicker value={text.gradient.stops[0].color}
            onChange={(color) => update({ gradient: { ...text.gradient!, stops: [{ ...text.gradient!.stops[0], color }, text.gradient!.stops[1]] } })} />
          <span className="text-gray-400 text-xs">to</span>
          <ColorPicker value={text.gradient.stops[1].color}
            onChange={(color) => update({ gradient: { ...text.gradient!, stops: [text.gradient!.stops[0], { ...text.gradient!.stops[1], color }] } })} />
        </div>
      )}

      {/* Alignment & Direction */}
      <div className="flex gap-2">
        <div className="flex-1 space-y-1">
          <span className="text-xs text-gray-500">Align</span>
          <div className="flex gap-1">
            {(["left", "center", "right"] as const).map((a) => (
              <button key={a} onClick={() => update({ alignment: a })}
                className={`flex-1 px-1 py-1 text-xs rounded capitalize
                  ${text.alignment === a ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <span className="text-xs text-gray-500">Direction</span>
          <div className="flex gap-1">
            {(["ltr", "rtl"] as const).map((d) => (
              <button key={d} onClick={() => update({ direction: d })}
                className={`flex-1 px-1 py-1 text-xs rounded uppercase
                  ${text.direction === d ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Line height & letter spacing */}
      <Slider label="Line height" value={text.lineHeight} min={0.8} max={3} step={0.1}
        onChange={(lineHeight) => update({ lineHeight })} />
      <Slider label="Letter spacing" value={text.letterSpacing} min={-5} max={20} step={0.5} unit="px"
        onChange={(letterSpacing) => update({ letterSpacing })} />
      <Slider label="Max width" value={text.maxWidth} min={100} max={2000} step={10} unit="px"
        onChange={(maxWidth) => update({ maxWidth })} />

      {/* Text shadow */}
      <Toggle label="Text shadow" checked={text.shadow.enabled}
        onChange={(enabled) => update({ shadow: { ...text.shadow, enabled } })} />
      {text.shadow.enabled && (
        <div className="space-y-2 pl-2 border-l-2 border-indigo-200">
          <ColorPicker label="Color" value={text.shadow.color}
            onChange={(color) => update({ shadow: { ...text.shadow, color } })} />
          <Slider label="Offset X" value={text.shadow.offsetX} min={-50} max={50} unit="px"
            onChange={(offsetX) => update({ shadow: { ...text.shadow, offsetX } })} />
          <Slider label="Offset Y" value={text.shadow.offsetY} min={-50} max={50} unit="px"
            onChange={(offsetY) => update({ shadow: { ...text.shadow, offsetY } })} />
          <Slider label="Blur" value={text.shadow.blur} min={0} max={100} unit="px"
            onChange={(blur) => update({ shadow: { ...text.shadow, blur } })} />
        </div>
      )}
    </CollapsibleSection>
  );
}
