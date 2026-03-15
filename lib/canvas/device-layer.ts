import type { DeviceMockupLayer } from "../types";
import { getDevice } from "@/devices";
import { getCachedImage } from "./image-cache";
import { applyTransform2D, applyShadow, clearShadow, renderWith3DTransform } from "./transform";

export function drawDeviceLayer(
  ctx: CanvasRenderingContext2D,
  layer: DeviceMockupLayer,
): void {
  if (!layer.visible) return;

  const device = getDevice(layer.deviceId);
  if (!device) return;

  const { frameWidth, frameHeight, screenX, screenY, screenWidth, screenHeight } = device;

  // Create offscreen canvas for compositing
  const offscreen = document.createElement("canvas");
  offscreen.width = frameWidth;
  offscreen.height = frameHeight;
  const offCtx = offscreen.getContext("2d");
  if (!offCtx) return;

  const frameImg = getCachedImage(device.framePath);
  const isPngFrame = device.frameFormat === "png" && frameImg;

  if (isPngFrame) {
    // PNG mockup workflow:
    // 1. Draw the frame first (it has the device body)
    offCtx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);

    // 2. Draw screenshot INTO the screen area using destination-atop
    //    This replaces the dark screen pixels with the screenshot
    if (layer.screenshotSrc) {
      const screenshotImg = getCachedImage(layer.screenshotSrc);
      if (screenshotImg) {
        offCtx.save();
        // Clip to screen area and draw screenshot
        offCtx.beginPath();
        roundedRect(offCtx, screenX, screenY, screenWidth, screenHeight, 20);
        offCtx.clip();

        // Use source-atop to only paint where pixels already exist (inside the frame)
        offCtx.globalCompositeOperation = "source-atop";

        // Scale screenshot to fill screen area (cover mode)
        const scaleX = screenWidth / screenshotImg.width;
        const scaleY = screenHeight / screenshotImg.height;
        const scale = Math.max(scaleX, scaleY);
        const dw = screenshotImg.width * scale;
        const dh = screenshotImg.height * scale;
        const dx = screenX + (screenWidth - dw) / 2;
        const dy = screenY + (screenHeight - dh) / 2;
        offCtx.drawImage(screenshotImg, dx, dy, dw, dh);

        offCtx.restore();

        // 3. Re-draw frame on top so bezels and notch cover screenshot edges
        offCtx.save();
        offCtx.globalCompositeOperation = "source-over";
        // Only redraw the bezel areas (outside screen) to preserve screenshot
        // Draw full frame, the transparent screen area won't overwrite screenshot
        offCtx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);
        offCtx.restore();
      }
    }
  } else {
    // SVG / fallback workflow (original):
    // 1. Draw screenshot first
    if (layer.screenshotSrc) {
      const screenshotImg = getCachedImage(layer.screenshotSrc);
      if (screenshotImg) {
        offCtx.save();
        offCtx.beginPath();
        offCtx.rect(screenX, screenY, screenWidth, screenHeight);
        offCtx.clip();
        const scaleX = screenWidth / screenshotImg.width;
        const scaleY = screenHeight / screenshotImg.height;
        const scale = Math.max(scaleX, scaleY);
        const dw = screenshotImg.width * scale;
        const dh = screenshotImg.height * scale;
        const dx = screenX + (screenWidth - dw) / 2;
        const dy = screenY + (screenHeight - dh) / 2;
        offCtx.drawImage(screenshotImg, dx, dy, dw, dh);
        offCtx.restore();
      }
    } else {
      // Placeholder screen
      offCtx.fillStyle = "#1a1a2e";
      offCtx.fillRect(screenX, screenY, screenWidth, screenHeight);
      offCtx.fillStyle = "#4a4a6a";
      offCtx.font = `${Math.round(screenWidth * 0.04)}px sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText("Drop screenshot here", screenX + screenWidth / 2, screenY + screenHeight / 2);
    }

    // 2. Draw SVG frame on top (transparent screen area shows screenshot through)
    if (frameImg) {
      offCtx.drawImage(frameImg, 0, 0, frameWidth, frameHeight);
    } else {
      drawFallbackFrame(offCtx, device, layer.frameColor);
    }
  }

  // Draw composited result onto main canvas
  ctx.save();
  ctx.globalAlpha = layer.opacity;

  if (layer.shadow.enabled) {
    applyShadow(ctx, layer.shadow);
  }

  if (layer.transform3d) {
    applyTransform2D(ctx, layer.transform2d, frameWidth / 2, frameHeight / 2);
    renderWith3DTransform(offscreen, ctx, layer.transform3d, 0, 0, frameWidth, frameHeight);
  } else {
    applyTransform2D(ctx, layer.transform2d, frameWidth / 2, frameHeight / 2);
    ctx.drawImage(offscreen, 0, 0);
  }

  clearShadow(ctx);
  ctx.restore();
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawFallbackFrame(
  ctx: CanvasRenderingContext2D,
  device: { screenX: number; screenY: number; screenWidth: number; screenHeight: number; frameWidth: number; frameHeight: number },
  frameColor: string,
): void {
  const borderRadius = Math.min(device.frameWidth, device.frameHeight) * 0.06;

  ctx.fillStyle = frameColor;
  ctx.beginPath();
  roundedRect(ctx, 0, 0, device.frameWidth, device.frameHeight, borderRadius);
  ctx.fill();

  // Cut out screen area
  ctx.clearRect(device.screenX, device.screenY, device.screenWidth, device.screenHeight);

  // Inner bezel edge
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  roundedRect(ctx, device.screenX - 1, device.screenY - 1, device.screenWidth + 2, device.screenHeight + 2, borderRadius * 0.5);
  ctx.stroke();

  // Notch / Dynamic Island for phones
  if (device.frameHeight > device.frameWidth) {
    const notchWidth = device.screenWidth * 0.3;
    const notchHeight = device.screenX * 0.4;
    const notchX = device.screenX + (device.screenWidth - notchWidth) / 2;
    const notchY = device.screenY;
    ctx.fillStyle = frameColor;
    ctx.beginPath();
    roundedRect(ctx, notchX, notchY - 2, notchWidth, notchHeight, notchHeight / 2);
    ctx.fill();
  }
}
