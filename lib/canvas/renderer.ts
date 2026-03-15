import type { CanvasPanel, Layer, ProjectState } from "../types";
import { drawBackground } from "./background";
import { drawDeviceLayer } from "./device-layer";
import { drawTextLayer } from "./text-layer";
import { drawImageLayer } from "./image-layer";

export function renderPanel(
  ctx: CanvasRenderingContext2D,
  panel: CanvasPanel,
): void {
  const { width, height } = panel;
  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, panel.background, width, height);

  const sortedLayers = [...panel.layers].sort((a, b) => a.zIndex - b.zIndex);
  for (const layer of sortedLayers) {
    if (!layer.visible) continue;
    drawLayer(ctx, layer);
  }
}

/**
 * Render split-screen: two panels side by side as one combined canvas.
 * Layers from panel[0] are drawn across the full combined width.
 * A divider line marks the boundary between panels.
 */
export function renderSplitCanvas(
  ctx: CanvasRenderingContext2D,
  state: ProjectState,
  gap: number = 0,
): void {
  const p1 = state.panels[0];
  const p2 = state.panels[1];
  if (!p1 || !p2) return;

  const totalWidth = p1.width + gap + p2.width;
  const maxHeight = Math.max(p1.height, p2.height);

  ctx.clearRect(0, 0, totalWidth, maxHeight);

  // Draw panel 1 background
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, p1.width, p1.height);
  ctx.clip();
  drawBackground(ctx, p1.background, p1.width, p1.height);
  ctx.restore();

  // Draw panel 2 background
  ctx.save();
  ctx.beginPath();
  ctx.rect(p1.width + gap, 0, p2.width, p2.height);
  ctx.clip();
  ctx.translate(p1.width + gap, 0);
  drawBackground(ctx, p2.background, p2.width, p2.height);
  ctx.restore();

  // Draw all layers from panel 1 across the full combined space
  const sortedLayers = [...p1.layers].sort((a, b) => a.zIndex - b.zIndex);
  for (const layer of sortedLayers) {
    if (!layer.visible) continue;
    drawLayer(ctx, layer);
  }

  // Draw divider line
  if (gap > 0) {
    ctx.save();
    ctx.strokeStyle = "#6366F1";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.moveTo(p1.width + gap / 2, 0);
    ctx.lineTo(p1.width + gap / 2, maxHeight);
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Export a single panel from split-screen by clipping.
 * panelIndex 0 = left, 1 = right.
 */
export function renderSplitPanelToBlob(
  state: ProjectState,
  panelIndex: number,
  format: "png" | "jpeg" = "png",
  quality = 0.95,
): Promise<Blob> {
  const p1 = state.panels[0];
  const p2 = state.panels[1];
  if (!p1 || !p2) return Promise.reject(new Error("Two panels required"));

  const targetPanel = state.panels[panelIndex];
  const canvas = document.createElement("canvas");
  canvas.width = targetPanel.width;
  canvas.height = targetPanel.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas context not available"));

  // Draw background
  drawBackground(ctx, targetPanel.background, targetPanel.width, targetPanel.height);

  // Offset layers for panel 2 (shift left by panel1.width)
  if (panelIndex === 1) {
    ctx.translate(-p1.width, 0);
  }

  // Draw all layers (they're all in panel[0])
  const sortedLayers = [...p1.layers].sort((a, b) => a.zIndex - b.zIndex);
  for (const layer of sortedLayers) {
    if (!layer.visible) continue;
    // Clip to target panel bounds
    ctx.save();
    if (panelIndex === 1) {
      ctx.beginPath();
      ctx.rect(p1.width, 0, p2.width, p2.height);
      ctx.clip();
    } else {
      ctx.beginPath();
      ctx.rect(0, 0, p1.width, p1.height);
      ctx.clip();
    }
    drawLayer(ctx, layer);
    ctx.restore();
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      `image/${format}`,
      quality,
    );
  });
}

function drawLayer(ctx: CanvasRenderingContext2D, layer: Layer): void {
  switch (layer.type) {
    case "device-mockup":
      drawDeviceLayer(ctx, layer);
      break;
    case "text":
      drawTextLayer(ctx, layer);
      break;
    case "image":
      drawImageLayer(ctx, layer);
      break;
  }
}

export function renderToBlob(
  panel: CanvasPanel,
  format: "png" | "jpeg" = "png",
  quality = 0.95,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = panel.width;
  canvas.height = panel.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Canvas context not available"));

  renderPanel(ctx, panel);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
      `image/${format}`,
      quality,
    );
  });
}
