"use client";

import { useCallback, useRef, type PointerEvent } from "react";
import type { Layer, Transform2D } from "@/lib/types";
import { getLayerBounds } from "@/lib/canvas/hit-test";

type DragMode = "move" | "scale-tl" | "scale-tr" | "scale-bl" | "scale-br" | "rotate";

interface SelectionOverlayProps {
  layer: Layer;
  zoom: number;
  onTransform: (layerId: string, changes: Partial<Transform2D>) => void;
}

export function SelectionOverlay({ layer, zoom, onTransform }: SelectionOverlayProps) {
  const bounds = getLayerBounds(layer);
  if (!bounds) return null;

  const { x, y, width, height, rotation } = bounds;

  const dragging = useRef<{
    mode: DragMode;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    origScaleX: number;
    origScaleY: number;
    origRotation: number;
  } | null>(null);

  const startDrag = useCallback(
    (e: PointerEvent, mode: DragMode) => {
      e.stopPropagation();
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      dragging.current = {
        mode,
        startX: e.clientX,
        startY: e.clientY,
        origX: layer.transform2d.x,
        origY: layer.transform2d.y,
        origScaleX: layer.transform2d.scaleX,
        origScaleY: layer.transform2d.scaleY,
        origRotation: layer.transform2d.rotation,
      };
    },
    [layer.transform2d],
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragging.current) return;
      e.stopPropagation();
      const d = dragging.current;

      if (d.mode === "move") {
        const dx = (e.clientX - d.startX) / zoom;
        const dy = (e.clientY - d.startY) / zoom;
        onTransform(layer.id, { x: d.origX + dx, y: d.origY + dy });
      } else if (d.mode === "rotate") {
        const el = (e.currentTarget as HTMLElement).closest("[data-selection]");
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const startAngle = Math.atan2(d.startY - cy, d.startX - cx);
        const curAngle = Math.atan2(e.clientY - cy, e.clientX - cx);
        let newRot = d.origRotation + ((curAngle - startAngle) * 180) / Math.PI;

        // Snap to 0, 90, -90, 180
        for (const snap of [0, 90, -90, 180, -180]) {
          if (Math.abs(newRot - snap) < 5) { newRot = snap; break; }
        }
        onTransform(layer.id, { rotation: newRot });
      } else {
        // Scale
        const el = (e.currentTarget as HTMLElement).closest("[data-selection]");
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const startDist = Math.hypot(d.startX - cx, d.startY - cy);
        const curDist = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (startDist < 1) return;

        const ratio = curDist / startDist;
        onTransform(layer.id, {
          scaleX: Math.max(0.05, Math.min(3, d.origScaleX * ratio)),
          scaleY: Math.max(0.05, Math.min(3, d.origScaleY * ratio)),
        });
      }
    },
    [layer.id, zoom, onTransform],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  if (layer.locked) {
    return (
      <div
        className="absolute pointer-events-none"
        style={{ left: x * zoom, top: y * zoom, width: width * zoom, height: height * zoom,
          transform: `rotate(${rotation}deg)`, transformOrigin: "center center" }}
      >
        <div className="absolute inset-0 border-2 border-gray-400 rounded-sm border-dashed" />
        <div className="absolute -top-6 left-0 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap">
          {layer.name} (locked)
        </div>
      </div>
    );
  }

  const handle = "bg-white border-2 border-indigo-500 rounded-sm pointer-events-auto hover:bg-indigo-100 active:bg-indigo-200";

  return (
    <div
      data-selection
      className="absolute"
      style={{ left: x * zoom, top: y * zoom, width: width * zoom, height: height * zoom,
        transform: `rotate(${rotation}deg)`, transformOrigin: "center center" }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Move area — the entire selection body is draggable */}
      <div
        className="absolute inset-0 cursor-move pointer-events-auto border-2 border-indigo-500 rounded-sm"
        onPointerDown={(e) => startDrag(e, "move")}
      />

      {/* Corner scale handles */}
      <div className={`absolute -top-2 -left-2 w-4 h-4 ${handle} cursor-nwse-resize z-10`}
        onPointerDown={(e) => startDrag(e, "scale-tl")} />
      <div className={`absolute -top-2 -right-2 w-4 h-4 ${handle} cursor-nesw-resize z-10`}
        onPointerDown={(e) => startDrag(e, "scale-tr")} />
      <div className={`absolute -bottom-2 -left-2 w-4 h-4 ${handle} cursor-nesw-resize z-10`}
        onPointerDown={(e) => startDrag(e, "scale-bl")} />
      <div className={`absolute -bottom-2 -right-2 w-4 h-4 ${handle} cursor-nwse-resize z-10`}
        onPointerDown={(e) => startDrag(e, "scale-br")} />

      {/* Rotation handle */}
      <div className="absolute left-1/2 -translate-x-1/2 z-10" style={{ top: -36 }}>
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-5 bg-indigo-400" style={{ bottom: -20 }} />
        <div
          className={`w-5 h-5 rounded-full ${handle} cursor-grab active:cursor-grabbing flex items-center justify-center`}
          onPointerDown={(e) => startDrag(e, "rotate")}
        >
          <svg className="w-3 h-3 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4 12a8 8 0 0114-5.3" strokeLinecap="round" />
            <path d="M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Layer name */}
      <div className="absolute -bottom-6 left-0 bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none">
        {layer.name}
      </div>
    </div>
  );
}
