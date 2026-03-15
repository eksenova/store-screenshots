import type { Transform2D, Transform3D, Shadow } from "../types";

/**
 * Apply 2D transform: position at (t.x, t.y) as top-left,
 * scale and rotate around the anchor point (center of object).
 */
export function applyTransform2D(
  ctx: CanvasRenderingContext2D,
  t: Transform2D,
  anchorX: number,
  anchorY: number,
): void {
  const cx = t.x + anchorX * t.scaleX;
  const cy = t.y + anchorY * t.scaleY;

  ctx.translate(cx, cy);
  ctx.rotate((t.rotation * Math.PI) / 180);
  ctx.scale(t.scaleX, t.scaleY);
  ctx.translate(-anchorX, -anchorY);
}

export function applyShadow(ctx: CanvasRenderingContext2D, shadow: Shadow): void {
  if (!shadow.enabled) return;
  ctx.shadowColor = shadow.color;
  ctx.shadowOffsetX = shadow.offsetX;
  ctx.shadowOffsetY = shadow.offsetY;
  ctx.shadowBlur = shadow.blur;
}

export function clearShadow(ctx: CanvasRenderingContext2D): void {
  ctx.shadowColor = "transparent";
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.shadowBlur = 0;
}

/**
 * Render a source canvas with 3D perspective transform.
 * Uses CSS 3D transforms on a temporary DOM element, then captures the result.
 */
export function renderWith3DTransform(
  sourceCanvas: HTMLCanvasElement,
  destCtx: CanvasRenderingContext2D,
  t3d: Transform3D,
  destX: number,
  destY: number,
  width: number,
  height: number,
): void {
  // Simplified 3D: use 2D canvas approximation with skew/scale
  // Map 3D rotations to 2D affine transform (simplified perspective)
  const perspective = t3d.perspective || 1000;
  const radX = (t3d.rotateX * Math.PI) / 180;
  const radY = (t3d.rotateY * Math.PI) / 180;
  const radZ = (t3d.rotateZ * Math.PI) / 180;

  // Perspective scale factors
  const cosX = Math.cos(radX);
  const cosY = Math.cos(radY);

  // Foreshortening based on rotation
  const scaleH = cosX; // vertical compression from X rotation
  const scaleW = cosY; // horizontal compression from Y rotation

  // Perspective skew (simulates depth)
  const skewX = Math.sin(radY) * 0.5;
  const skewY = Math.sin(radX) * 0.5;

  destCtx.save();

  // Move to center of destination area
  const cx = destX + width / 2;
  const cy = destY + height / 2;
  destCtx.translate(cx, cy);

  // Apply Z rotation
  destCtx.rotate(radZ);

  // Apply perspective via transform matrix
  // [a, b, c, d, e, f] = [scaleX, skewY, skewX, scaleY, translateX, translateY]
  destCtx.transform(cosY, skewY, skewX, cosX, 0, 0);

  // Draw the source centered
  destCtx.drawImage(
    sourceCanvas,
    -width / 2,
    -height / 2,
    width,
    height,
  );

  destCtx.restore();
}
