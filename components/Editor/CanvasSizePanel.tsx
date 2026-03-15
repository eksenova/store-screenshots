"use client";

import { useState } from "react";
import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { NumberInput } from "@/components/ui/NumberInput";

type StoreFilter = "all" | "ios" | "android";

interface SizePreset {
  label: string;
  width: number;
  height: number;
  required: boolean;
}

const iosPresets: SizePreset[] = [
  { label: '6.9" Display', width: 1320, height: 2868, required: true },
  { label: '6.5" Display', width: 1284, height: 2778, required: false },
  { label: '6.3" Display', width: 1206, height: 2622, required: false },
  { label: '6.1" Display', width: 1179, height: 2556, required: false },
  { label: '5.5" Display', width: 1242, height: 2208, required: false },
  { label: '4.7" Display', width: 750, height: 1334, required: false },
  { label: '13" iPad', width: 2064, height: 2752, required: true },
  { label: '11" iPad', width: 1668, height: 2388, required: false },
  { label: '10.5" iPad', width: 1668, height: 2224, required: false },
  { label: '9.7" iPad', width: 1536, height: 2048, required: false },
];

const androidPresets: SizePreset[] = [
  { label: "Phone Portrait", width: 1080, height: 1920, required: true },
  { label: "Phone Hi-res", width: 1440, height: 2560, required: false },
  { label: "Phone Landscape", width: 1920, height: 1080, required: false },
  { label: '7" Tablet', width: 1200, height: 1920, required: false },
  { label: '10" Tablet', width: 1600, height: 2560, required: false },
  { label: "Tablet Landscape", width: 1920, height: 1200, required: false },
];

export function CanvasSizePanel() {
  const { activePanel, dispatch } = useEditor();
  const { width, height } = activePanel;
  const [filter, setFilter] = useState<StoreFilter>("all");

  const setSize = (w: number, h: number) => {
    dispatch({ type: "UPDATE_PANEL_SIZE", panelId: activePanel.id, width: w, height: h });
  };

  const isSelected = (p: SizePreset) => p.width === width && p.height === height;

  const groups = filter === "ios"
    ? [{ title: "App Store", presets: iosPresets }]
    : filter === "android"
      ? [{ title: "Play Store", presets: androidPresets }]
      : [
          { title: "App Store", presets: iosPresets.filter((p) => p.required) },
          { title: "Play Store", presets: androidPresets.filter((p) => p.required || p.label === "Phone Hi-res") },
        ];

  return (
    <CollapsibleSection title="Export Size">
      <p className="text-[10px] text-gray-400 mb-2">
        Store'a yüklenecek screenshot boyutu
      </p>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <NumberInput label="W" value={width} min={100} max={8000} step={1} unit="px"
          onChange={(w) => setSize(w, height)} />
        <NumberInput label="H" value={height} min={100} max={8000} step={1} unit="px"
          onChange={(h) => setSize(width, h)} />
      </div>

      <div className="flex gap-1 mb-2">
        {([
          { key: "all" as const, label: "Essentials" },
          { key: "ios" as const, label: "App Store" },
          { key: "android" as const, label: "Play Store" },
        ]).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex-1 px-2 py-1 text-[10px] rounded
              ${filter === key ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-3 max-h-48 overflow-y-auto">
        {groups.map(({ title, presets }) => (
          <div key={title}>
            <div className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</div>
            <div className="space-y-0.5">
              {presets.map((p) => (
                <button
                  key={`${p.label}-${p.width}`}
                  onClick={() => setSize(p.width, p.height)}
                  className={`w-full flex items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors
                    ${isSelected(p)
                      ? "bg-indigo-50 border border-indigo-300 text-indigo-700"
                      : "hover:bg-gray-50 text-gray-700 border border-transparent"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{p.label}</span>
                    {p.required && (
                      <span className="text-[8px] bg-red-100 text-red-600 px-1 rounded">required</span>
                    )}
                  </div>
                  <span className="text-gray-400 text-[10px] font-mono">{p.width}x{p.height}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}
