"use client";

import { useEffect } from "react";
import type { EditorStateReturn } from "./useEditorState";

export function useKeyboardShortcuts(editor: EditorStateReturn) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      // Don't intercept when typing in inputs
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      const ctrl = e.ctrlKey || e.metaKey;

      // Undo: Ctrl+Z
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        editor.undo();
        return;
      }

      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((ctrl && e.key === "z" && e.shiftKey) || (ctrl && e.key === "y")) {
        e.preventDefault();
        editor.redo();
        return;
      }

      // Delete selected layer: Delete or Backspace
      if ((e.key === "Delete" || e.key === "Backspace") && editor.selectedLayer) {
        e.preventDefault();
        editor.removeLayer(editor.selectedLayer.id);
        return;
      }

      // Duplicate: Ctrl+D
      if (ctrl && e.key === "d" && editor.selectedLayer) {
        e.preventDefault();
        editor.duplicateLayer(editor.selectedLayer.id);
        return;
      }

      // Deselect: Escape
      if (e.key === "Escape") {
        editor.selectLayer(null);
        return;
      }

      // Move with arrow keys
      if (editor.selectedLayer && !editor.selectedLayer.locked) {
        const step = e.shiftKey ? 10 : 1;
        const t = editor.selectedLayer.transform2d;

        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            editor.setTransform2D(editor.selectedLayer.id, { y: t.y - step });
            return;
          case "ArrowDown":
            e.preventDefault();
            editor.setTransform2D(editor.selectedLayer.id, { y: t.y + step });
            return;
          case "ArrowLeft":
            e.preventDefault();
            editor.setTransform2D(editor.selectedLayer.id, { x: t.x - step });
            return;
          case "ArrowRight":
            e.preventDefault();
            editor.setTransform2D(editor.selectedLayer.id, { x: t.x + step });
            return;
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [editor]);
}
