import type { ProjectState } from "../types";
import { renderToBlob, renderSplitPanelToBlob } from "./renderer";

export async function exportPanel(
  state: ProjectState,
  panelIndex: number,
  format: "png" | "jpeg" = "png",
  quality = 0.95,
): Promise<Blob> {
  if (state.mode === "split-horizontal" && state.panels.length === 2) {
    return renderSplitPanelToBlob(state, panelIndex, format, quality);
  }

  const panel = state.panels[panelIndex];
  if (!panel) throw new Error(`Panel ${panelIndex} not found`);
  return renderToBlob(panel, format, quality);
}

export async function exportAllAsZip(
  state: ProjectState,
  format: "png" | "jpeg" = "png",
  quality = 0.95,
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  for (let i = 0; i < state.panels.length; i++) {
    const blob = await exportPanel(state, i, format, quality);
    const ext = format === "jpeg" ? "jpg" : "png";
    zip.file(`screenshot_${i + 1}.${ext}`, blob);
  }

  return zip.generateAsync({ type: "blob" });
}

/**
 * Download a blob as a file using native browser APIs.
 * No external dependency needed.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();

  // Cleanup after a short delay
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, 100);
}
