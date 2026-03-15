import type { DeviceDefinition, FrameFormat } from "@/devices/types";
import { allDevices } from "@/devices";
import { psdToDataUrl } from "./psd-parser";
import { loadImage } from "./canvas/image-cache";

// Storage key for custom mockups
const STORAGE_KEY = "store-screenshots:custom-mockups";

export interface CustomMockup {
  id: string;
  name: string;
  brand: "apple" | "android" | "custom";
  category: "phone" | "tablet";
  store: "app-store" | "play-store";
  screenWidth: number;
  screenHeight: number;
  screenX: number;
  screenY: number;
  frameWidth: number;
  frameHeight: number;
  framePath: string; // data URL for custom mockups
  frameFormat: FrameFormat;
  year?: number;
  isCustom: true;
}

/**
 * Load a PNG file as a custom mockup frame.
 */
export async function loadPngMockup(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => resolve({ dataUrl, width: img.width, height: img.height });
      img.onerror = () => reject(new Error("Failed to load PNG"));
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Load a PSD file as a custom mockup frame.
 */
export async function loadPsdMockup(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  return psdToDataUrl(file);
}

/**
 * Load a mockup file (PNG or PSD) and return image data.
 */
export async function loadMockupFile(file: File): Promise<{ dataUrl: string; width: number; height: number; format: FrameFormat }> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "psd") {
    const result = await loadPsdMockup(file);
    return { ...result, format: "psd" };
  }

  if (ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp") {
    const result = await loadPngMockup(file);
    return { ...result, format: "png" };
  }

  if (ext === "svg") {
    const text = await file.text();
    const blob = new Blob([text], { type: "image/svg+xml" });
    const dataUrl = URL.createObjectURL(blob);
    // Load to get dimensions
    const img = await loadImage(dataUrl);
    return { dataUrl, width: img.width || 1000, height: img.height || 2000, format: "svg" };
  }

  throw new Error(`Unsupported file format: ${ext}`);
}

/**
 * Create a custom device definition from an uploaded mockup file.
 */
export function createCustomDevice(
  name: string,
  frameDataUrl: string,
  frameWidth: number,
  frameHeight: number,
  frameFormat: FrameFormat,
  screenRegion: { x: number; y: number; width: number; height: number },
): CustomMockup {
  const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    name,
    brand: "custom" as "apple" | "android" | "custom",
    category: frameHeight > frameWidth ? "phone" : "tablet",
    store: "app-store",
    screenWidth: screenRegion.width,
    screenHeight: screenRegion.height,
    screenX: screenRegion.x,
    screenY: screenRegion.y,
    frameWidth,
    frameHeight,
    framePath: frameDataUrl,
    frameFormat,
    isCustom: true,
  } as CustomMockup;
}

/**
 * Save custom mockups to localStorage.
 */
export function saveCustomMockups(mockups: CustomMockup[]): void {
  try {
    // For large data URLs, store separately
    const metadata = mockups.map((m) => ({
      ...m,
      framePath: m.framePath.length > 1000 ? `__stored_${m.id}` : m.framePath,
    }));

    for (const m of mockups) {
      if (m.framePath.length > 1000) {
        localStorage.setItem(`${STORAGE_KEY}:frame:${m.id}`, m.framePath);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  } catch {
    console.warn("Failed to save custom mockups — storage quota may be exceeded");
  }
}

/**
 * Load custom mockups from localStorage.
 */
export function loadCustomMockups(): CustomMockup[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const mockups: CustomMockup[] = JSON.parse(stored);

    // Restore large frame data URLs
    return mockups.map((m) => {
      if (m.framePath.startsWith("__stored_")) {
        const id = m.framePath.replace("__stored_", "");
        const frameData = localStorage.getItem(`${STORAGE_KEY}:frame:${id}`);
        return { ...m, framePath: frameData || "" };
      }
      return m;
    });
  } catch {
    return [];
  }
}

/**
 * Delete a custom mockup from localStorage.
 */
export function deleteCustomMockup(id: string): void {
  const mockups = loadCustomMockups().filter((m) => m.id !== id);
  localStorage.removeItem(`${STORAGE_KEY}:frame:${id}`);
  saveCustomMockups(mockups);
}

/**
 * Get all devices including custom mockups.
 */
export function getAllDevicesWithCustom(): (DeviceDefinition | CustomMockup)[] {
  const custom = loadCustomMockups();
  return [...allDevices, ...custom];
}
