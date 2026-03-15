// ── Color & Background ──────────────────────────────────────────

export interface GradientStop {
  color: string;
  position: number; // 0-1
}

export interface LinearGradient {
  type: "linear";
  angle: number; // degrees
  stops: GradientStop[];
}

export interface RadialGradient {
  type: "radial";
  centerX: number; // 0-1
  centerY: number; // 0-1
  stops: GradientStop[];
}

export type Background =
  | { type: "solid"; color: string }
  | LinearGradient
  | RadialGradient
  | { type: "image"; src: string; fit: "cover" | "contain" | "stretch" | "tile" };

// ── Shadow ──────────────────────────────────────────────────────

export interface Shadow {
  enabled: boolean;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
}

// ── Transform ───────────────────────────────────────────────────

export interface Transform2D {
  x: number;
  y: number;
  rotation: number; // degrees
  scaleX: number;
  scaleY: number;
}

export interface Transform3D {
  perspective: number; // px
  rotateX: number; // degrees
  rotateY: number; // degrees
  rotateZ: number; // degrees
}

// ── Text ────────────────────────────────────────────────────────

export interface TextConfig {
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number; // 100-900
  color: string;
  alignment: "left" | "center" | "right";
  direction: "ltr" | "rtl";
  lineHeight: number; // multiplier e.g. 1.4
  letterSpacing: number; // px
  maxWidth: number; // px, for text wrapping
  gradient: LinearGradient | null; // text gradient fill
  shadow: Shadow;
}

// ── Layers ──────────────────────────────────────────────────────

export type LayerType = "device-mockup" | "text" | "image";

export interface LayerBase {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  zIndex: number;
  transform2d: Transform2D;
  transform3d: Transform3D | null;
  opacity: number; // 0-1
  shadow: Shadow;
}

export interface DeviceMockupLayer extends LayerBase {
  type: "device-mockup";
  deviceId: string;
  screenshotSrc: string | null;
  frameColor: string;
}

export interface TextLayer extends LayerBase {
  type: "text";
  text: TextConfig;
}

export interface ImageLayer extends LayerBase {
  type: "image";
  src: string;
  width: number;
  height: number;
  fit: "cover" | "contain" | "stretch";
}

export type Layer = DeviceMockupLayer | TextLayer | ImageLayer;

// ── Canvas Panel ────────────────────────────────────────────────

export type SplitScreenMode = "single" | "split-horizontal";

export interface CanvasPanel {
  id: string;
  width: number;
  height: number;
  background: Background;
  layers: Layer[];
}

// ── Project State ───────────────────────────────────────────────

export interface ProjectState {
  mode: SplitScreenMode;
  panels: CanvasPanel[];
  selectedLayerId: string | null;
  selectedPanelId: string;
  spanningLayerIds: string[];
  zoom: number;
}

// ── Defaults ────────────────────────────────────────────────────

export const DEFAULT_SHADOW: Shadow = {
  enabled: false,
  color: "rgba(0,0,0,0.3)",
  offsetX: 0,
  offsetY: 4,
  blur: 12,
  spread: 0,
};

export const DEFAULT_TRANSFORM_2D: Transform2D = {
  x: 0,
  y: 0,
  rotation: 0,
  scaleX: 1,
  scaleY: 1,
};

export const DEFAULT_TEXT_CONFIG: TextConfig = {
  content: "Your App Title",
  fontFamily: "Inter",
  fontSize: 64,
  fontWeight: 700,
  color: "#FFFFFF",
  alignment: "center",
  direction: "ltr",
  lineHeight: 1.3,
  letterSpacing: 0,
  maxWidth: 800,
  gradient: null,
  shadow: { ...DEFAULT_SHADOW },
};
