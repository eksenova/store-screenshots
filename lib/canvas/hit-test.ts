import type { Layer, CanvasPanel } from "../types";
import { getDevice } from "@/devices";

/**
 * Find which layer was clicked, checking from top (highest zIndex) to bottom.
 */
export function hitTestLayers(
  panel: CanvasPanel,
  clickX: number,
  clickY: number,
): Layer | null {
  const sorted = [...panel.layers]
    .filter((l) => l.visible && !l.locked)
    .sort((a, b) => b.zIndex - a.zIndex);

  for (const layer of sorted) {
    if (isPointInLayer(layer, clickX, clickY)) {
      return layer;
    }
  }
  return null;
}

function isPointInLayer(layer: Layer, px: number, py: number): boolean {
  const bounds = getLayerBounds(layer);
  if (!bounds) return false;

  const { x, y, width, height, rotation } = bounds;
  const cx = x + width / 2;
  const cy = y + height / 2;

  // Rotate the click point by the inverse of the layer's rotation around the layer's center
  const rad = (-rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = px - cx;
  const dy = py - cy;
  const rx = dx * cos - dy * sin + cx;
  const ry = dx * sin + dy * cos + cy;

  return rx >= x && rx <= x + width && ry >= y && ry <= y + height;
}

export function getLayerBounds(
  layer: Layer,
): { x: number; y: number; width: number; height: number; rotation: number } | null {
  const t = layer.transform2d;

  switch (layer.type) {
    case "device-mockup": {
      const device = getDevice(layer.deviceId);
      if (!device) return null;
      return {
        x: t.x,
        y: t.y,
        width: device.frameWidth * t.scaleX,
        height: device.frameHeight * t.scaleY,
        rotation: t.rotation,
      };
    }
    case "text":
      return {
        x: t.x,
        y: t.y,
        width: layer.text.maxWidth * t.scaleX,
        height: layer.text.fontSize * layer.text.lineHeight * 3 * t.scaleY, // estimate 3 lines
        rotation: t.rotation,
      };
    case "image":
      return {
        x: t.x,
        y: t.y,
        width: layer.width * t.scaleX,
        height: layer.height * t.scaleY,
        rotation: t.rotation,
      };
  }
}
