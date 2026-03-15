"use client";

import { useRef, useCallback, type RefObject } from "react";
import type { CanvasPanel, Layer, Transform2D } from "@/lib/types";
import { hitTestLayers } from "@/lib/canvas/hit-test";

interface UseCanvasInteractionOptions {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  panel: CanvasPanel;
  zoom: number;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onMoveLayer: (layerId: string, transform: Partial<Transform2D>) => void;
}

export function useCanvasInteraction({
  canvasRef,
  panel,
  zoom,
  selectedLayerId,
  onSelectLayer,
  onMoveLayer,
}: UseCanvasInteractionOptions) {
  const dragging = useRef<{ layerId: string; startX: number; startY: number; origX: number; origY: number } | null>(null);

  const getCanvasPoint = useCallback(
    (e: React.MouseEvent | React.PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / zoom,
        y: (e.clientY - rect.top) / zoom,
      };
    },
    [canvasRef, zoom],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const pt = getCanvasPoint(e);
      const hit = hitTestLayers(panel, pt.x, pt.y);

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
    [getCanvasPoint, panel, onSelectLayer],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const pt = getCanvasPoint(e);
      const dx = pt.x - dragging.current.startX;
      const dy = pt.y - dragging.current.startY;

      onMoveLayer(dragging.current.layerId, {
        x: dragging.current.origX + dx,
        y: dragging.current.origY + dy,
      });
    },
    [getCanvasPoint, onMoveLayer],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
