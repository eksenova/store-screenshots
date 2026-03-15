"use client";

import { useRef, useEffect, useCallback } from "react";
import type { ProjectState, Transform2D } from "@/lib/types";
import { renderSplitCanvas } from "@/lib/canvas/renderer";
import { onImageLoaded } from "@/lib/canvas/image-cache";
import { hitTestLayers } from "@/lib/canvas/hit-test";
import { SelectionOverlay } from "./SelectionOverlay";
import { SnapGuides } from "./SnapGuides";
import type { Layer } from "@/lib/types";

const SPLIT_GAP = 40; // px gap between panels in combined view

interface SplitCanvasViewProps {
  state: ProjectState;
  selectedLayer: Layer | null;
  onSelectLayer: (layerId: string | null) => void;
  onTransform: (layerId: string, changes: Partial<Transform2D>) => void;
}

export function SplitCanvasView({ state, selectedLayer, onSelectLayer, onTransform }: SplitCanvasViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const dragging = useRef<{ layerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const p1 = state.panels[0];
  const p2 = state.panels[1];
  if (!p1 || !p2) return null;

  const totalWidth = p1.width + SPLIT_GAP + p2.width;
  const maxHeight = Math.max(p1.height, p2.height);
  const zoom = state.zoom;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = totalWidth;
    canvas.height = maxHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    renderSplitCanvas(ctx, state, SPLIT_GAP);
  }, [state, totalWidth, maxHeight]);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  useEffect(() => {
    const unsubscribe = onImageLoaded(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(render);
    });
    return unsubscribe;
  }, [render]);

  const getCanvasPoint = useCallback(
    (e: React.PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
    },
    [zoom],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const pt = getCanvasPoint(e);
      // All layers are in panel[0]
      const hit = hitTestLayers(p1, pt.x, pt.y);
      if (hit) {
        onSelectLayer(hit.id);
        dragging.current = {
          layerId: hit.id,
          startX: pt.x,
          startY: pt.y,
          origX: hit.transform2d.x,
          origY: hit.transform2d.y,
        };
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      } else {
        onSelectLayer(null);
      }
    },
    [getCanvasPoint, p1, onSelectLayer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const pt = getCanvasPoint(e);
      const dx = pt.x - dragging.current.startX;
      const dy = pt.y - dragging.current.startY;
      onTransform(dragging.current.layerId, {
        x: dragging.current.origX + dx,
        y: dragging.current.origY + dy,
      });
    },
    [getCanvasPoint, onTransform],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  return (
    <div className="relative">
      {/* Panel labels */}
      <div className="absolute -top-6 left-0 text-xs px-2 py-0.5 rounded bg-indigo-600 text-white z-10">
        Panel 1
      </div>
      <div
        className="absolute -top-6 text-xs px-2 py-0.5 rounded bg-indigo-600 text-white z-10"
        style={{ left: (p1.width + SPLIT_GAP) * zoom }}
      >
        Panel 2
      </div>

      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="shadow-2xl cursor-crosshair"
        style={{
          width: totalWidth * zoom,
          height: maxHeight * zoom,
        }}
      />

      {/* Selection overlay spans full combined canvas */}
      {selectedLayer && (
        <SelectionOverlay layer={selectedLayer} zoom={zoom} onTransform={onTransform} />
      )}

      {/* Snap guides for panel 1 */}
      <SnapGuides panel={p1} selectedLayer={selectedLayer} zoom={zoom} />
    </div>
  );
}
