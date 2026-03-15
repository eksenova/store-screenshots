"use client";

import { useReducer, useCallback, useRef, useMemo } from "react";
import { editorReducer, createInitialState } from "@/lib/editor-state";
import type { EditorAction } from "@/lib/editor-state";
import type { Background, Transform2D, Transform3D, TextConfig } from "@/lib/types";
import {
  createUndoRedoState,
  pushState,
  undo as undoHistory,
  redo as redoHistory,
  canUndo as checkCanUndo,
  canRedo as checkCanRedo,
  type UndoRedoState,
} from "@/lib/undo-redo";

type HistoryAction =
  | { type: "EDITOR_ACTION"; action: EditorAction }
  | { type: "UNDO" }
  | { type: "REDO" };

// Actions that should NOT create undo history (too frequent)
const TRANSIENT_ACTIONS = new Set(["SET_ZOOM", "SELECT_LAYER", "SELECT_PANEL"]);

function historyReducer(state: UndoRedoState, action: HistoryAction): UndoRedoState {
  switch (action.type) {
    case "EDITOR_ACTION": {
      const newPresent = editorReducer(state.present, action.action);
      if (newPresent === state.present) return state;
      if (TRANSIENT_ACTIONS.has(action.action.type)) {
        return { ...state, present: newPresent };
      }
      return pushState(state, newPresent);
    }
    case "UNDO":
      return undoHistory(state);
    case "REDO":
      return redoHistory(state);
    default:
      return state;
  }
}

export function useEditorState() {
  const [history, historyDispatch] = useReducer(
    historyReducer,
    null,
    () => createUndoRedoState(createInitialState()),
  );

  const state = history.present;
  const canUndo = checkCanUndo(history);
  const canRedo = checkCanRedo(history);

  const dispatch = useCallback(
    (action: EditorAction) => historyDispatch({ type: "EDITOR_ACTION", action }),
    [],
  );

  const handleUndo = useCallback(() => historyDispatch({ type: "UNDO" }), []);
  const handleRedo = useCallback(() => historyDispatch({ type: "REDO" }), []);

  const activePanel = useMemo(
    () => state.panels.find((p) => p.id === state.selectedPanelId) ?? state.panels[0],
    [state.panels, state.selectedPanelId],
  );

  const selectedLayer = useMemo(
    () => activePanel.layers.find((l) => l.id === state.selectedLayerId) ?? null,
    [activePanel.layers, state.selectedLayerId],
  );

  const addDeviceMockup = useCallback(
    (deviceId?: string) => dispatch({ type: "ADD_DEVICE_MOCKUP", panelId: activePanel.id, deviceId }),
    [dispatch, activePanel.id],
  );

  const addTextLayer = useCallback(
    () => dispatch({ type: "ADD_TEXT_LAYER", panelId: activePanel.id }),
    [dispatch, activePanel.id],
  );

  const addImageLayer = useCallback(
    (src: string, width: number, height: number) =>
      dispatch({ type: "ADD_IMAGE_LAYER", panelId: activePanel.id, src, width, height }),
    [dispatch, activePanel.id],
  );

  const removeLayer = useCallback(
    (layerId: string) => dispatch({ type: "REMOVE_LAYER", panelId: activePanel.id, layerId }),
    [dispatch, activePanel.id],
  );

  const duplicateLayer = useCallback(
    (layerId: string) => dispatch({ type: "DUPLICATE_LAYER", panelId: activePanel.id, layerId }),
    [dispatch, activePanel.id],
  );

  const selectLayer = useCallback(
    (layerId: string | null) => dispatch({ type: "SELECT_LAYER", layerId }),
    [dispatch],
  );

  const setTransform2D = useCallback(
    (layerId: string, transform: Partial<Transform2D>) =>
      dispatch({ type: "SET_TRANSFORM_2D", panelId: activePanel.id, layerId, transform }),
    [dispatch, activePanel.id],
  );

  const setTransform3D = useCallback(
    (layerId: string, transform: Transform3D | null) =>
      dispatch({ type: "SET_TRANSFORM_3D", panelId: activePanel.id, layerId, transform }),
    [dispatch, activePanel.id],
  );

  const setBackground = useCallback(
    (background: Background) =>
      dispatch({ type: "SET_BACKGROUND", panelId: activePanel.id, background }),
    [dispatch, activePanel.id],
  );

  const setText = useCallback(
    (layerId: string, text: Partial<TextConfig>) =>
      dispatch({ type: "SET_TEXT", panelId: activePanel.id, layerId, text }),
    [dispatch, activePanel.id],
  );

  const setScreenshot = useCallback(
    (layerId: string, src: string | null) =>
      dispatch({ type: "SET_SCREENSHOT", panelId: activePanel.id, layerId, src }),
    [dispatch, activePanel.id],
  );

  return {
    state,
    dispatch,
    activePanel,
    selectedLayer,
    canUndo,
    canRedo,
    undo: handleUndo,
    redo: handleRedo,
    addDeviceMockup,
    addTextLayer,
    addImageLayer,
    removeLayer,
    duplicateLayer,
    selectLayer,
    setTransform2D,
    setTransform3D,
    setBackground,
    setText,
    setScreenshot,
  };
}

export type EditorStateReturn = ReturnType<typeof useEditorState>;
