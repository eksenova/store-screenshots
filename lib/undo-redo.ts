import type { ProjectState } from "./types";

const MAX_HISTORY = 50;

export interface UndoRedoState {
  past: ProjectState[];
  present: ProjectState;
  future: ProjectState[];
}

export function createUndoRedoState(initial: ProjectState): UndoRedoState {
  return {
    past: [],
    present: initial,
    future: [],
  };
}

export function pushState(history: UndoRedoState, newState: ProjectState): UndoRedoState {
  // Don't push if state hasn't changed
  if (history.present === newState) return history;

  const past = [...history.past, history.present];
  if (past.length > MAX_HISTORY) past.shift();

  return {
    past,
    present: newState,
    future: [], // Clear future on new action
  };
}

export function undo(history: UndoRedoState): UndoRedoState {
  if (history.past.length === 0) return history;

  const previous = history.past[history.past.length - 1];
  const past = history.past.slice(0, -1);

  return {
    past,
    present: previous,
    future: [history.present, ...history.future],
  };
}

export function redo(history: UndoRedoState): UndoRedoState {
  if (history.future.length === 0) return history;

  const next = history.future[0];
  const future = history.future.slice(1);

  return {
    past: [...history.past, history.present],
    present: next,
    future,
  };
}

export function canUndo(history: UndoRedoState): boolean {
  return history.past.length > 0;
}

export function canRedo(history: UndoRedoState): boolean {
  return history.future.length > 0;
}
