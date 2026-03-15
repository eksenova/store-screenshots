/**
 * Official App Store and Play Store screenshot specifications.
 * Sources:
 * - Apple: https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/
 * - Google: https://support.google.com/googleplay/android-developer/answer/9866151
 *
 * Last updated: 2025
 */

export type Store = "app-store" | "play-store";
export type DeviceType = "iphone" | "ipad" | "android-phone" | "android-tablet" | "mac" | "apple-tv" | "apple-watch" | "vision-pro" | "wear-os";

export interface StoreSpec {
  store: Store;
  device: string;
  deviceType: DeviceType;
  width: number;
  height: number;
  required: boolean;
  /** Landscape alternative */
  landscape?: { width: number; height: number };
}

// ── App Store — iPhone ──────────────────────────────────────────

export const appStoreIPhoneSpecs: StoreSpec[] = [
  {
    store: "app-store",
    device: 'iPhone 6.9" (16 Pro Max, 15 Pro Max)',
    deviceType: "iphone",
    width: 1320,
    height: 2868,
    required: true,
    landscape: { width: 2868, height: 1320 },
  },
  {
    store: "app-store",
    device: 'iPhone 6.9" Alt (1290x2796)',
    deviceType: "iphone",
    width: 1290,
    height: 2796,
    required: false,
    landscape: { width: 2796, height: 1290 },
  },
  {
    store: "app-store",
    device: 'iPhone 6.9" Alt (1260x2736)',
    deviceType: "iphone",
    width: 1260,
    height: 2736,
    required: false,
    landscape: { width: 2736, height: 1260 },
  },
  {
    store: "app-store",
    device: 'iPhone 6.5" (11 Pro Max, XS Max)',
    deviceType: "iphone",
    width: 1284,
    height: 2778,
    required: false,
    landscape: { width: 2778, height: 1284 },
  },
  {
    store: "app-store",
    device: 'iPhone 6.3" (16 Pro, 15 Pro)',
    deviceType: "iphone",
    width: 1206,
    height: 2622,
    required: false,
    landscape: { width: 2622, height: 1206 },
  },
  {
    store: "app-store",
    device: 'iPhone 6.1" (16, 15, 14 Pro)',
    deviceType: "iphone",
    width: 1179,
    height: 2556,
    required: false,
    landscape: { width: 2556, height: 1179 },
  },
  {
    store: "app-store",
    device: 'iPhone 5.5" (8 Plus, 7 Plus)',
    deviceType: "iphone",
    width: 1242,
    height: 2208,
    required: false,
    landscape: { width: 2208, height: 1242 },
  },
  {
    store: "app-store",
    device: 'iPhone 4.7" (SE 3rd/2nd, 8, 7)',
    deviceType: "iphone",
    width: 750,
    height: 1334,
    required: false,
    landscape: { width: 1334, height: 750 },
  },
];

// ── App Store — iPad ────────────────────────────────────────────

export const appStoreIPadSpecs: StoreSpec[] = [
  {
    store: "app-store",
    device: 'iPad 13" (Pro M5/M4, Air M4/M3)',
    deviceType: "ipad",
    width: 2064,
    height: 2752,
    required: true,
    landscape: { width: 2752, height: 2064 },
  },
  {
    store: "app-store",
    device: 'iPad 13" Alt (2048x2732)',
    deviceType: "ipad",
    width: 2048,
    height: 2732,
    required: false,
    landscape: { width: 2732, height: 2048 },
  },
  {
    store: "app-store",
    device: 'iPad 11" (Pro, Air, mini)',
    deviceType: "ipad",
    width: 1668,
    height: 2388,
    required: false,
    landscape: { width: 2388, height: 1668 },
  },
  {
    store: "app-store",
    device: 'iPad 11" Alt (1488x2266)',
    deviceType: "ipad",
    width: 1488,
    height: 2266,
    required: false,
    landscape: { width: 2266, height: 1488 },
  },
  {
    store: "app-store",
    device: 'iPad 10.5" (Air 3rd, iPad 9-7th)',
    deviceType: "ipad",
    width: 1668,
    height: 2224,
    required: false,
    landscape: { width: 2224, height: 1668 },
  },
  {
    store: "app-store",
    device: 'iPad 9.7" (older iPads)',
    deviceType: "ipad",
    width: 1536,
    height: 2048,
    required: false,
    landscape: { width: 2048, height: 1536 },
  },
];

// ── Play Store ──────────────────────────────────────────────────

export const playStoreSpecs: StoreSpec[] = [
  {
    store: "play-store",
    device: "Phone (Portrait)",
    deviceType: "android-phone",
    width: 1080,
    height: 1920,
    required: true,
  },
  {
    store: "play-store",
    device: "Phone Hi-res (Portrait)",
    deviceType: "android-phone",
    width: 1440,
    height: 2560,
    required: false,
  },
  {
    store: "play-store",
    device: "Phone Landscape",
    deviceType: "android-phone",
    width: 1920,
    height: 1080,
    required: false,
  },
  {
    store: "play-store",
    device: '7" Tablet (Portrait)',
    deviceType: "android-tablet",
    width: 1200,
    height: 1920,
    required: false,
  },
  {
    store: "play-store",
    device: '10" Tablet (Portrait)',
    deviceType: "android-tablet",
    width: 1600,
    height: 2560,
    required: false,
  },
  {
    store: "play-store",
    device: "Tablet Landscape",
    deviceType: "android-tablet",
    width: 1920,
    height: 1200,
    required: false,
  },
];

// ── Aggregated ──────────────────────────────────────────────────

export const appStoreSpecs: StoreSpec[] = [
  ...appStoreIPhoneSpecs,
  ...appStoreIPadSpecs,
];

export const allSpecs: StoreSpec[] = [
  ...appStoreSpecs,
  ...playStoreSpecs,
];

/** Get only the most commonly used (required + popular) specs */
export function getEssentialSpecs(): StoreSpec[] {
  return allSpecs.filter(
    (s) =>
      s.required ||
      (s.device.includes("6.3") && s.store === "app-store") ||
      (s.device.includes("6.1") && s.store === "app-store") ||
      (s.device === "Phone Hi-res (Portrait)" && s.store === "play-store"),
  );
}
