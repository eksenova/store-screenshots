/**
 * Official App Store and Play Store screenshot specifications.
 * Reference:
 * - Apple: https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications
 * - Google: https://support.google.com/googleplay/android-developer/answer/9866151
 */

export interface StoreSpec {
  store: "app-store" | "play-store";
  device: string;
  width: number;
  height: number;
  required: boolean;
}

export const appStoreSpecs: StoreSpec[] = [
  // iPhone
  { store: "app-store", device: "iPhone 16 Pro Max (6.9\")", width: 1320, height: 2868, required: true },
  { store: "app-store", device: "iPhone 16 Pro (6.3\")", width: 1206, height: 2622, required: false },
  { store: "app-store", device: "iPhone 16 (6.1\")", width: 1179, height: 2556, required: false },
  { store: "app-store", device: "iPhone SE (4.7\")", width: 750, height: 1334, required: false },
  // iPad
  { store: "app-store", device: "iPad Pro 13\" (M4)", width: 2064, height: 2752, required: true },
  { store: "app-store", device: "iPad Pro 11\" (M4)", width: 1668, height: 2388, required: false },
];

export const playStoreSpecs: StoreSpec[] = [
  // Phone
  { store: "play-store", device: "Phone", width: 1080, height: 1920, required: true },
  { store: "play-store", device: "Phone (Hi-res)", width: 1440, height: 2560, required: false },
  // Tablet
  { store: "play-store", device: "7\" Tablet", width: 1200, height: 1920, required: false },
  { store: "play-store", device: "10\" Tablet", width: 1600, height: 2560, required: false },
];

export const allSpecs = [...appStoreSpecs, ...playStoreSpecs];
