"use client";

import { useState, useRef, useEffect } from "react";
import { searchFonts } from "@/lib/fonts";
import { useFonts } from "@/hooks/useFonts";

interface FontPickerProps {
  value: string;
  onChange: (family: string) => void;
}

export function FontPicker({ value, onChange }: FontPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { loadFont } = useFonts();
  const ref = useRef<HTMLDivElement>(null);

  const results = searchFonts(query);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectFont = async (family: string) => {
    await loadFont(family);
    onChange(family);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-xs text-gray-500">Font</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-left text-sm hover:bg-gray-50"
        style={{ fontFamily: `"${value}", sans-serif` }}
      >
        {value}
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fonts..."
              className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {results.map((font) => (
              <button
                key={font}
                onClick={() => selectFont(font)}
                onMouseEnter={() => loadFont(font)}
                className={`w-full px-3 py-1.5 text-left text-sm hover:bg-indigo-50 transition-colors
                  ${font === value ? "bg-indigo-50 text-indigo-700" : "text-gray-700"}`}
                style={{ fontFamily: `"${font}", sans-serif` }}
              >
                {font}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
