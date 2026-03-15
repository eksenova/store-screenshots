"use client";

import { useState, useCallback } from "react";
import { loadFont as loadFontUtil, isFontLoaded } from "@/lib/fonts";

export function useFonts() {
  const [, setVersion] = useState(0);

  const loadFont = useCallback(async (family: string) => {
    if (isFontLoaded(family)) return;
    await loadFontUtil(family);
    // Force re-render after font loads
    setVersion((v) => v + 1);
  }, []);

  return { loadFont, isFontLoaded };
}
