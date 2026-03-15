export type DeviceBrand = "apple" | "android";
export type DeviceCategory = "phone" | "tablet";
export type StoreType = "app-store" | "play-store";
export type FrameFormat = "svg" | "png" | "psd";

export interface DeviceDefinition {
  /** Unique device identifier */
  id: string;
  /** Display name */
  name: string;
  /** Device brand */
  brand: DeviceBrand;
  /** Phone or tablet */
  category: DeviceCategory;
  /** Target store */
  store: StoreType;
  /** Required screenshot width in pixels */
  screenWidth: number;
  /** Required screenshot height in pixels */
  screenHeight: number;
  /** Screen X offset within the frame */
  screenX: number;
  /** Screen Y offset within the frame */
  screenY: number;
  /** Total frame width */
  frameWidth: number;
  /** Total frame height */
  frameHeight: number;
  /** Path to frame file (SVG, PNG, or PSD) */
  framePath: string;
  /** Frame image format */
  frameFormat: FrameFormat;
  /** Year of release */
  year?: number;
  /** Color variants available */
  colorVariants?: string[];
  /** Thumbnail preview path (small PNG for picker UI) */
  thumbnailPath?: string;
}

/** @deprecated Use ProjectState from lib/types.ts instead */
export interface ScreenshotConfig {
  device: DeviceDefinition;
  screenshotSrc: string | null;
  title: string;
  subtitle: string;
  fontFamily: string;
  titleSize: number;
  subtitleSize: number;
  titleColor: string;
  subtitleColor: string;
  backgroundColor: string;
  backgroundGradient: string | null;
  frameColor: string;
  textPosition: "top" | "bottom";
  padding: number;
}
