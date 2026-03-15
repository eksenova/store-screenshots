import type { TextLayer } from "../types";
import { applyTransform2D, applyShadow, clearShadow } from "./transform";

export function drawTextLayer(
  ctx: CanvasRenderingContext2D,
  layer: TextLayer,
): void {
  if (!layer.visible || !layer.text.content.trim()) return;

  const { text } = layer;
  const lines = wrapText(ctx, text.content, text.fontFamily, text.fontSize, text.fontWeight, text.maxWidth);

  const totalHeight = lines.length * text.fontSize * text.lineHeight;
  const anchorX = text.alignment === "center" ? text.maxWidth / 2 : text.alignment === "right" ? text.maxWidth : 0;
  const anchorY = totalHeight / 2;

  ctx.save();
  ctx.globalAlpha = layer.opacity;

  applyTransform2D(ctx, layer.transform2d, anchorX, anchorY);

  // Set text properties
  ctx.font = `${text.fontWeight} ${text.fontSize}px "${text.fontFamily}", sans-serif`;
  ctx.textAlign = text.alignment;
  ctx.direction = text.direction;
  ctx.textBaseline = "top";

  // Apply text shadow
  if (text.shadow.enabled) {
    applyShadow(ctx, text.shadow);
  }

  // Determine fill style (solid or gradient)
  let fillStyle: string | CanvasGradient = text.color;
  if (text.gradient) {
    const grad = ctx.createLinearGradient(0, 0, text.maxWidth, totalHeight);
    for (const stop of text.gradient.stops) {
      grad.addColorStop(stop.position, stop.color);
    }
    fillStyle = grad;
  }
  ctx.fillStyle = fillStyle;

  // Set letter spacing if supported
  if (text.letterSpacing && "letterSpacing" in ctx) {
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${text.letterSpacing}px`;
  }

  // Draw each line
  const xOffset = text.alignment === "center" ? text.maxWidth / 2 : text.alignment === "right" ? text.maxWidth : 0;
  for (let i = 0; i < lines.length; i++) {
    const y = i * text.fontSize * text.lineHeight;
    ctx.fillText(lines[i], xOffset, y);
  }

  clearShadow(ctx);
  ctx.restore();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  fontSize: number,
  fontWeight: number,
  maxWidth: number,
): string[] {
  ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

  const paragraphs = text.split("\n");
  const lines: string[] = [];

  for (const para of paragraphs) {
    const words = para.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
  }

  return lines;
}
