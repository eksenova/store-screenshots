import { appleDevices } from "./apple";
import { androidDevices } from "./android";
import type { DeviceDefinition, DeviceBrand, DeviceCategory } from "./types";

export type { DeviceDefinition, DeviceBrand, DeviceCategory, FrameFormat } from "./types";
export type { ScreenshotConfig } from "./types";

/** All built-in devices */
export const allDevices: DeviceDefinition[] = [
  ...appleDevices,
  ...androidDevices,
];

/** Get device by ID (searches built-in devices) */
export function getDevice(id: string): DeviceDefinition | undefined {
  return allDevices.find((d) => d.id === id);
}

/** Filter devices by brand */
export function getDevicesByBrand(brand: DeviceBrand): DeviceDefinition[] {
  return allDevices.filter((d) => d.brand === brand);
}

/** Filter devices by category */
export function getDevicesByCategory(
  category: DeviceCategory,
): DeviceDefinition[] {
  return allDevices.filter((d) => d.category === category);
}

/** Default device */
export const defaultDevice = appleDevices[0];
