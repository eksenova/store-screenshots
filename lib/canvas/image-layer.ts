import type { ImageLayer } from "../types";
import { getCachedImage } from "./image-cache";
import { applyTransform2D, applyShadow, clearShadow, renderWith3DTransform } from "./transform";

export function drawImageLayer(
  ctx: CanvasRenderingContext2D,
  layer: ImageLayer,
): void {
  if (!layer.visible) return;

  const img = getCachedImage(layer.src);
  if (!img) return;

  ctx.save();
  ctx.globalAlpha = layer.opacity;

  if (layer.shadow.enabled) {
    applyShadow(ctx, layer.shadow);
  }

  const { width, height } = layer;
  const anchorX = width / 2;
  const anchorY = height / 2;

  if (layer.transform3d) {
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const offCtx = offscreen.getContext("2d");
    if (offCtx) {
      drawImageWithFit(offCtx, img, width, height, layer.fit);
      applyTransform2D(ctx, layer.transform2d, anchorX, anchorY);
      renderWith3DTransform(offscreen, ctx, layer.transform3d, 0, 0, width, height);
    }
  } else {
    applyTransform2D(ctx, layer.transform2d, anchorX, anchorY);
    drawImageWithFit(ctx, img, width, height, layer.fit);
  }

  clearShadow(ctx);
  ctx.restore();
}

function drawImageWithFit(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  fit: "cover" | "contain" | "stretch",
): void {
  switch (fit) {
    case "stretch":
      ctx.drawImage(img, 0, 0, width, height);
      break;

    case "cover": {
      const scale = Math.max(width / img.width, height / img.height);
      const sw = width / scale;
      const sh = height / scale;
      const sx = (img.width - sw) / 2;
      const sy = (img.height - sh) / 2;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
      break;
    }

    case "contain": {
      const scale = Math.min(width / img.width, height / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (width - dw) / 2;
      const dy = (height - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      break;
    }
  }
}
