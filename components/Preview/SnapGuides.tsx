"use client";

import type { CanvasPanel, Layer } from "@/lib/types";
import { getLayerBounds } from "@/lib/canvas/hit-test";

interface SnapGuidesProps {
  panel: CanvasPanel;
  selectedLayer: Layer | null;
  zoom: number;
}

export function SnapGuides({ panel, selectedLayer, zoom }: SnapGuidesProps) {
  if (!selectedLayer) return null;

  const bounds = getLayerBounds(selectedLayer);
  if (!bounds) return null;

  const guides: { type: "h" | "v"; pos: number }[] = [];
  const canvasCenterX = panel.width / 2;
  const canvasCenterY = panel.height / 2;
  const layerCenterX = bounds.x + bounds.width / 2;
  const layerCenterY = bounds.y + bounds.height / 2;

  const threshold = 5; // snap within 5px

  // Canvas center guides
  if (Math.abs(layerCenterX - canvasCenterX) < threshold) {
    guides.push({ type: "v", pos: canvasCenterX });
  }
  if (Math.abs(layerCenterY - canvasCenterY) < threshold) {
    guides.push({ type: "h", pos: canvasCenterY });
  }

  // Edge alignment with canvas
  if (Math.abs(bounds.x) < threshold) {
    guides.push({ type: "v", pos: 0 });
  }
  if (Math.abs(bounds.x + bounds.width - panel.width) < threshold) {
    guides.push({ type: "v", pos: panel.width });
  }
  if (Math.abs(bounds.y) < threshold) {
    guides.push({ type: "h", pos: 0 });
  }
  if (Math.abs(bounds.y + bounds.height - panel.height) < threshold) {
    guides.push({ type: "h", pos: panel.height });
  }

  if (guides.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {guides.map((guide, i) =>
        guide.type === "v" ? (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-indigo-400 opacity-60"
            style={{ left: guide.pos * zoom }}
          />
        ) : (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-indigo-400 opacity-60"
            style={{ top: guide.pos * zoom }}
          />
        ),
      )}
    </div>
  );
}
