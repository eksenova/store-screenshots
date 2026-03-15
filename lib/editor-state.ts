import type {
  ProjectState,
  CanvasPanel,
  Layer,
  DeviceMockupLayer,
  TextLayer,
  ImageLayer,
  Background,
  Transform2D,
  Transform3D,
  TextConfig,
  SplitScreenMode,
} from "./types";
import { DEFAULT_SHADOW, DEFAULT_TRANSFORM_2D, DEFAULT_TEXT_CONFIG } from "./types";
import { defaultDevice, allDevices as allDevicesLookup } from "@/devices";

// ── Helpers ─────────────────────────────────────────────────────

let _idCounter = 0;
export function generateId(): string {
  return `layer_${Date.now()}_${++_idCounter}`;
}

function findPanel(state: ProjectState, panelId: string): CanvasPanel | undefined {
  return state.panels.find((p) => p.id === panelId);
}

function updatePanel(state: ProjectState, panelId: string, updater: (p: CanvasPanel) => CanvasPanel): ProjectState {
  return {
    ...state,
    panels: state.panels.map((p) => (p.id === panelId ? updater(p) : p)),
  };
}

function updateLayerInPanel(panel: CanvasPanel, layerId: string, updater: (l: Layer) => Layer): CanvasPanel {
  return {
    ...panel,
    layers: panel.layers.map((l) => (l.id === layerId ? updater(l) : l)),
  };
}

function nextZIndex(panel: CanvasPanel): number {
  return panel.layers.length === 0 ? 0 : Math.max(...panel.layers.map((l) => l.zIndex)) + 1;
}

// ── Actions ─────────────────────────────────────────────────────

export type EditorAction =
  // Layer CRUD
  | { type: "ADD_DEVICE_MOCKUP"; panelId: string; deviceId?: string }
  | { type: "ADD_TEXT_LAYER"; panelId: string }
  | { type: "ADD_IMAGE_LAYER"; panelId: string; src: string; width: number; height: number }
  | { type: "REMOVE_LAYER"; panelId: string; layerId: string }
  | { type: "DUPLICATE_LAYER"; panelId: string; layerId: string }
  | { type: "REORDER_LAYERS"; panelId: string; layerIds: string[] }
  // Layer properties
  | { type: "UPDATE_LAYER"; panelId: string; layerId: string; changes: Partial<Layer> }
  | { type: "SET_VISIBILITY"; panelId: string; layerId: string; visible: boolean }
  | { type: "SET_LOCK"; panelId: string; layerId: string; locked: boolean }
  | { type: "RENAME_LAYER"; panelId: string; layerId: string; name: string }
  | { type: "SET_TRANSFORM_2D"; panelId: string; layerId: string; transform: Partial<Transform2D> }
  | { type: "SET_TRANSFORM_3D"; panelId: string; layerId: string; transform: Transform3D | null }
  | { type: "SET_OPACITY"; panelId: string; layerId: string; opacity: number }
  // Selection
  | { type: "SELECT_LAYER"; layerId: string | null }
  | { type: "SELECT_PANEL"; panelId: string }
  // Device mockup
  | { type: "SET_DEVICE"; panelId: string; layerId: string; deviceId: string }
  | { type: "SET_SCREENSHOT"; panelId: string; layerId: string; src: string | null }
  | { type: "SET_FRAME_COLOR"; panelId: string; layerId: string; color: string }
  // Text
  | { type: "SET_TEXT"; panelId: string; layerId: string; text: Partial<TextConfig> }
  // Background
  | { type: "SET_BACKGROUND"; panelId: string; background: Background }
  // Canvas size
  | { type: "UPDATE_PANEL_SIZE"; panelId: string; width: number; height: number }
  // Split screen
  | { type: "SET_SPLIT_MODE"; mode: SplitScreenMode }
  | { type: "TOGGLE_SPANNING"; layerId: string }
  // Zoom
  | { type: "SET_ZOOM"; zoom: number }
  // Project
  | { type: "LOAD_PROJECT"; state: ProjectState }
  | { type: "RESET_PROJECT" };

// ── Factory functions ───────────────────────────────────────────

export function createDeviceMockupLayer(
  zIndex: number,
  deviceId?: string,
  canvasWidth?: number,
  canvasHeight?: number,
): DeviceMockupLayer {
  const id = generateId();
  const device = deviceId
    ? allDevicesLookup.find((d) => d.id === deviceId) ?? defaultDevice
    : defaultDevice;

  // Auto-fit mockup into canvas (80% of canvas area)
  let scaleX = 1;
  let scaleY = 1;
  let x = 0;
  let y = 0;

  if (canvasWidth && canvasHeight) {
    const fitScale = Math.min(
      (canvasWidth * 0.7) / device.frameWidth,
      (canvasHeight * 0.7) / device.frameHeight,
    );
    scaleX = fitScale;
    scaleY = fitScale;
    // Center in canvas
    x = (canvasWidth - device.frameWidth * fitScale) / 2;
    y = (canvasHeight - device.frameHeight * fitScale) / 2;
  }

  return {
    id,
    name: device.name,
    type: "device-mockup",
    visible: true,
    locked: false,
    zIndex,
    transform2d: { ...DEFAULT_TRANSFORM_2D, x, y, scaleX, scaleY },
    transform3d: null,
    opacity: 1,
    shadow: { ...DEFAULT_SHADOW },
    deviceId: device.id,
    screenshotSrc: null,
    frameColor: "#1A1A1A",
  };
}


export function createTextLayer(zIndex: number): TextLayer {
  const id = generateId();
  return {
    id,
    name: "Text",
    type: "text",
    visible: true,
    locked: false,
    zIndex,
    transform2d: { ...DEFAULT_TRANSFORM_2D, y: 60 },
    transform3d: null,
    opacity: 1,
    shadow: { ...DEFAULT_SHADOW },
    text: { ...DEFAULT_TEXT_CONFIG },
  };
}

export function createImageLayer(zIndex: number, src: string, width: number, height: number): ImageLayer {
  const id = generateId();
  return {
    id,
    name: "Image",
    type: "image",
    visible: true,
    locked: false,
    zIndex,
    transform2d: { ...DEFAULT_TRANSFORM_2D },
    transform3d: null,
    opacity: 1,
    shadow: { ...DEFAULT_SHADOW },
    src,
    width,
    height,
    fit: "contain",
  };
}

// ── Initial State ───────────────────────────────────────────────

export function createInitialState(): ProjectState {
  const panelId = "panel_main";
  return {
    mode: "single",
    panels: [
      {
        id: panelId,
        width: 1320,
        height: 2868,
        background: {
          type: "linear",
          angle: 135,
          stops: [
            { color: "#6366F1", position: 0 },
            { color: "#8B5CF6", position: 1 },
          ],
        },
        layers: [],
      },
    ],
    selectedLayerId: null,
    selectedPanelId: panelId,
    spanningLayerIds: [],
    zoom: 0.25,
  };
}

// ── Reducer ─────────────────────────────────────────────────────

export function editorReducer(state: ProjectState, action: EditorAction): ProjectState {
  switch (action.type) {
    case "ADD_DEVICE_MOCKUP": {
      const panel = findPanel(state, action.panelId);
      if (!panel) return state;
      const layer = createDeviceMockupLayer(nextZIndex(panel), action.deviceId, panel.width, panel.height);
      const newState = updatePanel(state, action.panelId, (p) => ({
        ...p,
        layers: [...p.layers, layer],
      }));
      return { ...newState, selectedLayerId: layer.id };
    }

    case "ADD_TEXT_LAYER": {
      const panel = findPanel(state, action.panelId);
      if (!panel) return state;
      const layer = createTextLayer(nextZIndex(panel));
      const newState = updatePanel(state, action.panelId, (p) => ({
        ...p,
        layers: [...p.layers, layer],
      }));
      return { ...newState, selectedLayerId: layer.id };
    }

    case "ADD_IMAGE_LAYER": {
      const panel = findPanel(state, action.panelId);
      if (!panel) return state;
      const layer = createImageLayer(nextZIndex(panel), action.src, action.width, action.height);
      const newState = updatePanel(state, action.panelId, (p) => ({
        ...p,
        layers: [...p.layers, layer],
      }));
      return { ...newState, selectedLayerId: layer.id };
    }

    case "REMOVE_LAYER": {
      const newState = updatePanel(state, action.panelId, (p) => ({
        ...p,
        layers: p.layers.filter((l) => l.id !== action.layerId),
      }));
      return {
        ...newState,
        selectedLayerId: state.selectedLayerId === action.layerId ? null : state.selectedLayerId,
        spanningLayerIds: state.spanningLayerIds.filter((id) => id !== action.layerId),
      };
    }

    case "DUPLICATE_LAYER": {
      const panel = findPanel(state, action.panelId);
      if (!panel) return state;
      const source = panel.layers.find((l) => l.id === action.layerId);
      if (!source) return state;
      const dup: Layer = {
        ...JSON.parse(JSON.stringify(source)),
        id: generateId(),
        name: `${source.name} (copy)`,
        zIndex: nextZIndex(panel),
        transform2d: { ...source.transform2d, x: source.transform2d.x + 20, y: source.transform2d.y + 20 },
      };
      const newState = updatePanel(state, action.panelId, (p) => ({
        ...p,
        layers: [...p.layers, dup],
      }));
      return { ...newState, selectedLayerId: dup.id };
    }

    case "REORDER_LAYERS": {
      return updatePanel(state, action.panelId, (p) => ({
        ...p,
        layers: action.layerIds
          .map((id, i) => {
            const layer = p.layers.find((l) => l.id === id);
            return layer ? { ...layer, zIndex: i } : null;
          })
          .filter((l): l is Layer => l !== null),
      }));
    }

    case "UPDATE_LAYER": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => ({ ...l, ...action.changes } as Layer)),
      );
    }

    case "SET_VISIBILITY": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => ({ ...l, visible: action.visible } as Layer)),
      );
    }

    case "SET_LOCK": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => ({ ...l, locked: action.locked } as Layer)),
      );
    }

    case "RENAME_LAYER": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => ({ ...l, name: action.name } as Layer)),
      );
    }

    case "SET_TRANSFORM_2D": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => ({
          ...l,
          transform2d: { ...l.transform2d, ...action.transform },
        } as Layer)),
      );
    }

    case "SET_TRANSFORM_3D": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => ({
          ...l,
          transform3d: action.transform,
        } as Layer)),
      );
    }

    case "SET_OPACITY": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => ({ ...l, opacity: action.opacity } as Layer)),
      );
    }

    case "SELECT_LAYER":
      return { ...state, selectedLayerId: action.layerId };

    case "SELECT_PANEL":
      return { ...state, selectedPanelId: action.panelId };

    case "SET_DEVICE": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => {
          if (l.type !== "device-mockup") return l;
          return { ...l, deviceId: action.deviceId };
        }),
      );
    }

    case "SET_SCREENSHOT": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => {
          if (l.type !== "device-mockup") return l;
          return { ...l, screenshotSrc: action.src };
        }),
      );
    }

    case "SET_FRAME_COLOR": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => {
          if (l.type !== "device-mockup") return l;
          return { ...l, frameColor: action.color };
        }),
      );
    }

    case "SET_TEXT": {
      return updatePanel(state, action.panelId, (p) =>
        updateLayerInPanel(p, action.layerId, (l) => {
          if (l.type !== "text") return l;
          return { ...l, text: { ...l.text, ...action.text } };
        }),
      );
    }

    case "SET_BACKGROUND":
      return updatePanel(state, action.panelId, (p) => ({
        ...p,
        background: action.background,
      }));

    case "UPDATE_PANEL_SIZE": {
      return updatePanel(state, action.panelId, (p) => ({
        ...p,
        width: action.width,
        height: action.height,
      }));
    }

    case "SET_SPLIT_MODE": {
      if (action.mode === "split-horizontal" && state.panels.length === 1) {
        const existing = state.panels[0];
        const newPanel: CanvasPanel = {
          id: "panel_right",
          width: existing.width,
          height: existing.height,
          background: { ...existing.background },
          layers: [],
        };
        return { ...state, mode: action.mode, panels: [existing, newPanel] };
      }
      if (action.mode === "single" && state.panels.length === 2) {
        return { ...state, mode: action.mode, panels: [state.panels[0]] };
      }
      return { ...state, mode: action.mode };
    }

    case "TOGGLE_SPANNING": {
      const has = state.spanningLayerIds.includes(action.layerId);
      return {
        ...state,
        spanningLayerIds: has
          ? state.spanningLayerIds.filter((id) => id !== action.layerId)
          : [...state.spanningLayerIds, action.layerId],
      };
    }

    case "SET_ZOOM":
      return { ...state, zoom: action.zoom };

    case "LOAD_PROJECT":
      return action.state;

    case "RESET_PROJECT":
      return createInitialState();

    default:
      return state;
  }
}
