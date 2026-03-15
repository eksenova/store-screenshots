import Psd from "@webtoon/psd";

export interface PsdLayerInfo {
  name: string;
  width: number;
  height: number;
  top: number;
  left: number;
  opacity: number;
  visible: boolean;
}

export interface PsdParseResult {
  width: number;
  height: number;
  composite: ImageData;
  compositeDataUrl: string;
  layers: PsdLayerInfo[];
}

/**
 * Parse a PSD file and return composite image + layer info.
 * Uses @webtoon/psd which runs entirely in the browser.
 */
export async function parsePsdFile(file: File): Promise<PsdParseResult> {
  const buffer = await file.arrayBuffer();
  const psd = Psd.parse(buffer);

  const { width, height } = psd;

  // Get composite image
  const compositeData = await psd.composite();
  const imageData = new ImageData(
    new Uint8ClampedArray(compositeData),
    width,
    height,
  );

  // Convert to data URL via offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(imageData, 0, 0);
  const compositeDataUrl = canvas.toDataURL("image/png");

  // Extract layer info
  const layers: PsdLayerInfo[] = [];
  for (const child of psd.children) {
    if (child.type === "Layer") {
      layers.push({
        name: child.name,
        width: child.width,
        height: child.height,
        top: child.top,
        left: child.left,
        opacity: child.opacity / 255,
        visible: !child.isHidden,
      });
    }
  }

  return {
    width,
    height,
    composite: imageData,
    compositeDataUrl,
    layers,
  };
}

/**
 * Parse PSD file and return as a simple image data URL.
 * Convenience function for using PSD files as mockup frames.
 */
export async function psdToDataUrl(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  const result = await parsePsdFile(file);
  return {
    dataUrl: result.compositeDataUrl,
    width: result.width,
    height: result.height,
  };
}
