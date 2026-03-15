import type { Background } from "../types";
import { getCachedImage } from "./image-cache";

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: Background,
  width: number,
  height: number,
): void {
  switch (bg.type) {
    case "solid":
      ctx.fillStyle = bg.color;
      ctx.fillRect(0, 0, width, height);
      break;

    case "linear":
      drawLinearGradient(ctx, bg.angle, bg.stops, width, height);
      break;

    case "radial":
      drawRadialGradient(ctx, bg.centerX, bg.centerY, bg.stops, width, height);
      break;

    case "image":
      drawImageBackground(ctx, bg.src, bg.fit, width, height);
      break;
  }
}

function drawLinearGradient(
  ctx: CanvasRenderingContext2D,
  angle: number,
  stops: { color: string; position: number }[],
  width: number,
  height: number,
): void {
  const rad = (angle * Math.PI) / 180;
  const cx = width / 2;
  const cy = height / 2;
  const len = Math.abs(width * Math.sin(rad)) + Math.abs(height * Math.cos(rad));
  const half = len / 2;

  const x0 = cx - Math.sin(rad) * half;
  const y0 = cy - Math.cos(rad) * half;
  const x1 = cx + Math.sin(rad) * half;
  const y1 = cy + Math.cos(rad) * half;

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  for (const stop of stops) {
    gradient.addColorStop(stop.position, stop.color);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawRadialGradient(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  stops: { color: string; position: number }[],
  width: number,
  height: number,
): void {
  const cx = centerX * width;
  const cy = centerY * height;
  const radius = Math.max(width, height);

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  for (const stop of stops) {
    gradient.addColorStop(stop.position, stop.color);
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawImageBackground(
  ctx: CanvasRenderingContext2D,
  src: string,
  fit: "cover" | "contain" | "stretch" | "tile",
  width: number,
  height: number,
): void {
  const img = getCachedImage(src);
  if (!img) return;

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

    case "tile": {
      const pattern = ctx.createPattern(img, "repeat");
      if (pattern) {
        ctx.fillStyle = pattern;
        ctx.fillRect(0, 0, width, height);
      }
      break;
    }
  }
}
