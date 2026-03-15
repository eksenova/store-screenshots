import type { ProjectState } from "./types";
import { createInitialState } from "./editor-state";

const STORAGE_KEY = "store-screenshots:templates";

export interface Template {
  id: string;
  name: string;
  category: string;
  preview?: string; // thumbnail data URL
  state: ProjectState;
  createdAt: string;
}

// ── Built-in presets ────────────────────────────────────────────

export const BUILT_IN_TEMPLATES: Omit<Template, "id" | "createdAt">[] = [
  {
    name: "Gradient Purple",
    category: "Minimal",
    state: {
      ...createInitialState(),
      panels: [{
        id: "panel_main",
        width: 1320,
        height: 2868,
        background: {
          type: "linear",
          angle: 135,
          stops: [
            { color: "#6366F1", position: 0 },
            { color: "#8B5CF6", position: 0.5 },
            { color: "#EC4899", position: 1 },
          ],
        },
        layers: [],
      }],
    },
  },
  {
    name: "Ocean Blue",
    category: "Minimal",
    state: {
      ...createInitialState(),
      panels: [{
        id: "panel_main",
        width: 1320,
        height: 2868,
        background: {
          type: "linear",
          angle: 180,
          stops: [
            { color: "#0EA5E9", position: 0 },
            { color: "#2563EB", position: 1 },
          ],
        },
        layers: [],
      }],
    },
  },
  {
    name: "Dark Elegance",
    category: "Dark",
    state: {
      ...createInitialState(),
      panels: [{
        id: "panel_main",
        width: 1320,
        height: 2868,
        background: {
          type: "linear",
          angle: 160,
          stops: [
            { color: "#1a1a2e", position: 0 },
            { color: "#16213e", position: 0.5 },
            { color: "#0f3460", position: 1 },
          ],
        },
        layers: [],
      }],
    },
  },
  {
    name: "Sunset Warm",
    category: "Vibrant",
    state: {
      ...createInitialState(),
      panels: [{
        id: "panel_main",
        width: 1320,
        height: 2868,
        background: {
          type: "linear",
          angle: 135,
          stops: [
            { color: "#F97316", position: 0 },
            { color: "#EF4444", position: 0.5 },
            { color: "#EC4899", position: 1 },
          ],
        },
        layers: [],
      }],
    },
  },
  {
    name: "Clean White",
    category: "Light",
    state: {
      ...createInitialState(),
      panels: [{
        id: "panel_main",
        width: 1320,
        height: 2868,
        background: { type: "solid", color: "#FFFFFF" },
        layers: [],
      }],
    },
  },
  {
    name: "Forest Green",
    category: "Nature",
    state: {
      ...createInitialState(),
      panels: [{
        id: "panel_main",
        width: 1320,
        height: 2868,
        background: {
          type: "linear",
          angle: 150,
          stops: [
            { color: "#059669", position: 0 },
            { color: "#065F46", position: 1 },
          ],
        },
        layers: [],
      }],
    },
  },
];

// ── Save / Load ─────────────────────────────────────────────────

export function saveTemplate(name: string, category: string, state: ProjectState): Template {
  const template: Template = {
    id: `template_${Date.now()}`,
    name,
    category,
    state: JSON.parse(JSON.stringify(state)),
    createdAt: new Date().toISOString(),
  };

  const existing = loadSavedTemplates();
  existing.push(template);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    console.warn("Failed to save template — storage quota exceeded");
  }

  return template;
}

export function loadSavedTemplates(): Template[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function deleteTemplate(id: string): void {
  const templates = loadSavedTemplates().filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function exportTemplateAsJson(template: Template): string {
  return JSON.stringify(template, null, 2);
}

export function importTemplateFromJson(json: string): Template {
  const parsed = JSON.parse(json);
  if (!parsed.name || !parsed.state) throw new Error("Invalid template format");
  return {
    ...parsed,
    id: `template_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
}
