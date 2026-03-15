"use client";

import { useEditor } from "@/components/EditorProvider";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { Button } from "@/components/ui/Button";
import { allDevices, getDevicesByBrand } from "@/devices";
import { useState } from "react";

export function DevicePicker() {
  const { addDeviceMockup } = useEditor();
  const [filter, setFilter] = useState<"all" | "apple" | "android">("all");

  const devices = filter === "all" ? allDevices : getDevicesByBrand(filter);

  return (
    <CollapsibleSection title="Devices">
      <div className="flex gap-1 mb-2">
        {(["all", "apple", "android"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-2 py-1 text-xs rounded capitalize transition-colors
              ${filter === f ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => addDeviceMockup(device.id)}
            className="rounded border border-gray-200 px-2 py-1.5 text-left text-xs hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
          >
            <div className="font-medium text-gray-800 truncate">{device.name}</div>
            <div className="text-gray-400 text-[10px]">{device.screenWidth}x{device.screenHeight}</div>
          </button>
        ))}
      </div>
    </CollapsibleSection>
  );
}
