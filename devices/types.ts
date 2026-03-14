export type DeviceBrand = "apple" | "android";
export type DeviceCategory = "phone" | "tablet";
export type StoreType = "app-store" | "play-store";

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
  /** Screen X offset within the SVG frame */
  screenX: number;
  /** Screen Y offset within the SVG frame */
  screenY: number;
  /** Total frame width (SVG viewBox) */
  frameWidth: number;
  /** Total frame height (SVG viewBox) */
  frameHeight: number;
  /** Path to SVG frame file */
  framePath: string;
}

export interface ScreenshotConfig {
  /** Selected device */
  device: DeviceDefinition;
  /** Uploaded screenshot image (data URL) */
  screenshotSrc: string | null;
  /** Title text above device */
  title: string;
  /** Subtitle text below title */
  subtitle: string;
  /** Title font family */
  fontFamily: string;
  /** Title font size in px */
  titleSize: number;
  /** Subtitle font size in px */
  subtitleSize: number;
  /** Title color */
  titleColor: string;
  /** Subtitle color */
  subtitleColor: string;
  /** Background color or gradient */
  backgroundColor: string;
  /** Background gradient (if set, overrides solid color) */
  backgroundGradient: string | null;
  /** Device frame color override */
  frameColor: string;
  /** Text position: top or bottom */
  textPosition: "top" | "bottom";
  /** Padding around device in px */
  padding: number;
}
