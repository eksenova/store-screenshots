"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useEditorState, type EditorStateReturn } from "@/hooks/useEditorState";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const EditorContext = createContext<EditorStateReturn | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const editor = useEditorState();
  useKeyboardShortcuts(editor);

  return (
    <EditorContext.Provider value={editor}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor(): EditorStateReturn {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be used within EditorProvider");
  return ctx;
}
