"use client";

import { useCallback } from "react";
import { useEditor } from "@/components/EditorProvider";
import { CanvasPanelView } from "./CanvasPanel";
import { SplitCanvasView } from "./SplitCanvasView";
import { SelectionOverlay } from "./SelectionOverlay";
import { SnapGuides } from "./SnapGuides";
import { Slider } from "@/components/ui/Slider";
import { Button } from "@/components/ui/Button";
import type { Transform2D } from "@/lib/types";

export function CanvasPreview() {
  const { state, dispatch, selectLayer, setTransform2D, setScreenshot, selectedLayer, activePanel, canUndo, canRedo, undo, redo } = useEditor();

  const handleTransform = useCallback(
    (layerId: string, transform: Partial<Transform2D>) => {
      setTransform2D(layerId, transform);
    },
    [setTransform2D],
  );

  const handleDropScreenshot = useCallback(
    (dataUrl: string, targetLayerId: string) => {
      setScreenshot(targetLayerId, dataUrl);
      selectLayer(targetLayerId);
    },
    [setScreenshot, selectLayer],
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.02 : 0.02;
        const newZoom = Math.max(0.05, Math.min(1, state.zoom + delta));
        dispatch({ type: "SET_ZOOM", zoom: newZoom });
      }
    },
    [state.zoom, dispatch],
  );

  const isSplit = state.mode === "split-horizontal" && state.panels.length === 2;

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
        <Button size="sm" variant="ghost" disabled={!canUndo} onClick={undo} title="Undo (Ctrl+Z)">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a4 4 0 014 4v2M3 10l4-4m-4 4l4 4" />
          </svg>
        </Button>
        <Button size="sm" variant="ghost" disabled={!canRedo} onClick={redo} title="Redo (Ctrl+Shift+Z)">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a4 4 0 00-4 4v2m14-6l-4-4m4 4l-4 4" />
          </svg>
        </Button>

        <div className="w-px h-5 bg-gray-200" />

        <span className="text-xs text-gray-500">Zoom</span>
        <div className="w-28">
          <Slider label="" value={state.zoom} min={0.05} max={1} step={0.01}
            onChange={(zoom) => dispatch({ type: "SET_ZOOM", zoom })} />
        </div>
        <span className="text-xs font-mono text-gray-600 w-10">{Math.round(state.zoom * 100)}%</span>
        <div className="flex gap-1">
          {[0.1, 0.15, 0.25, 0.5].map((z) => (
            <button key={z} onClick={() => dispatch({ type: "SET_ZOOM", zoom: z })}
              className={`px-1.5 py-0.5 text-[10px] rounded ${Math.abs(state.zoom - z) < 0.01 ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}>
              {Math.round(z * 100)}%
            </button>
          ))}
        </div>

        <div className="ml-auto text-[10px] text-gray-400 hidden lg:block">
          Ctrl+Z Undo | Ctrl+Scroll Zoom | Drag to move
        </div>
      </div>

      {/* Canvas area */}
      <div
        className="flex-1 overflow-auto bg-gray-100 flex items-start justify-center p-6
          bg-[radial-gradient(circle,#d1d5db_1px,transparent_1px)] bg-[length:20px_20px]"
        onWheel={handleWheel}
      >
        {isSplit ? (
          /* Split screen — single combined canvas */
          <SplitCanvasView
            state={state}
            selectedLayer={selectedLayer}
            onSelectLayer={selectLayer}
            onTransform={handleTransform}
          />
        ) : (
          /* Single panel */
          <div className="relative">
            <CanvasPanelView
              panel={activePanel}
              zoom={state.zoom}
              selectedLayerId={state.selectedLayerId}
              onSelectLayer={selectLayer}
              onMoveLayer={handleTransform}
              onDropScreenshot={handleDropScreenshot}
            />
            {selectedLayer && activePanel.layers.some((l) => l.id === selectedLayer.id) && (
              <SelectionOverlay layer={selectedLayer} zoom={state.zoom} onTransform={handleTransform} />
            )}
            <SnapGuides panel={activePanel} selectedLayer={selectedLayer} zoom={state.zoom} />
          </div>
        )}
      </div>
    </div>
  );
}
