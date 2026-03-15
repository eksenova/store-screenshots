"use client";

import { LayersPanel } from "./LayersPanel";
import { DevicePicker } from "./DevicePicker";
import { CustomMockupUpload } from "./CustomMockupUpload";
import { ScreenshotUpload } from "./ScreenshotUpload";
import { TextPanel } from "./TextPanel";
import { BackgroundPanel } from "./BackgroundPanel";
import { TransformPanel } from "./TransformPanel";
import { CanvasSizePanel } from "./CanvasSizePanel";
import { TemplatePanel } from "./TemplatePanel";
import { SplitScreenPanel } from "./SplitScreenPanel";
import { ExportPanel } from "./ExportPanel";

export function EditorSidebar() {
  return (
    <aside className="w-80 shrink-0 space-y-3 overflow-y-auto max-h-[calc(100vh-80px)] pb-6
      [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:bg-gray-300">
      <TemplatePanel />
      <CanvasSizePanel />
      <LayersPanel />
      <DevicePicker />
      <CustomMockupUpload />
      <ScreenshotUpload />
      <TextPanel />
      <BackgroundPanel />
      <TransformPanel />
      <SplitScreenPanel />
      <ExportPanel />
    </aside>
  );
}
