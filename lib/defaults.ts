import { defaultDevice } from "@/devices";
import type { ScreenshotConfig } from "@/devices";

export const defaultConfig: ScreenshotConfig = {
  device: defaultDevice,
  screenshotSrc: null,
  title: "Your App Title",
  subtitle: "A short description of this screen",
  fontFamily: "Inter",
  titleSize: 64,
  subtitleSize: 40,
  titleColor: "#FFFFFF",
  subtitleColor: "#E0E0E0",
  backgroundColor: "#6366F1",
  backgroundGradient: null,
  frameColor: "#1A1A1A",
  textPosition: "top",
  padding: 80,
};
