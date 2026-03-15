"use client";

import { useRef, useEffect, useCallback, type DragEvent } from "react";
import type { CanvasPanel as CanvasPanelType, DeviceMockupLayer } from "@/lib/types";
import { renderPanel } from "@/lib/canvas/renderer";
import { onImageLoaded, loadImage } from "@/lib/canvas/image-cache";
import { useCanvasInteraction } from "@/hooks/useCanvasInteraction";

interface CanvasPanelProps {
  panel: CanvasPanelType;
  zoom: number;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onMoveLayer: (layerId: string, transform: Partial<import("@/lib/types").Transform2D>) => void;
  onDropScreenshot?: (dataUrl: string, targetLayerId: string) => void;
}

export function CanvasPanelView({ panel, zoom, selectedLayerId, onSelectLayer, onMoveLayer, onDropScreenshot }: CanvasPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const { handlePointerDown, handlePointerMove, handlePointerUp } = useCanvasInteraction({
    canvasRef,
    panel,
    zoom,
    selectedLayerId,
    onSelectLayer,
    onMoveLayer,
  });

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = panel.width;
    canvas.height = panel.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    renderPanel(ctx, panel);
  }, [panel]);

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

  // Only allow drop if there's a device mockup to target
  const deviceLayers = panel.layers.filter((l) => l.type === "device-mockup") as DeviceMockupLayer[];
  const hasDeviceMockup = deviceLayers.length > 0;

  const handleDragOver = useCallback((e: DragEvent) => {
    if (!hasDeviceMockup) return; // Block drop if no mockup
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, [hasDeviceMockup]);

  const handleDrop = useCallback((e: DragEvent) => {
    if (!hasDeviceMockup) return; // Block drop if no mockup
    e.preventDefault();

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    // Find the best target device
    const selected = deviceLayers.find((l) => l.id === selectedLayerId);
    const emptyDevice = deviceLayers.find((l) => !l.screenshotSrc);
    const target = selected ?? emptyDevice ?? deviceLayers[0];
    if (!target) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      await loadImage(dataUrl);
      onDropScreenshot?.(dataUrl, target.id);
    };
    reader.readAsDataURL(file);
  }, [hasDeviceMockup, deviceLayers, selectedLayerId, onDropScreenshot]);

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="shadow-2xl cursor-crosshair"
      style={{
        width: panel.width * zoom,
        height: panel.height * zoom,
      }}
    />
  );
}
