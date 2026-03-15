"use client";

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-gray-500 w-16 shrink-0">{label}</span>}
      <div className="relative">
        <input
          type="color"
          value={value.startsWith("#") ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="w-7 h-7 rounded-md border border-gray-300 shadow-sm cursor-pointer"
          style={{ backgroundColor: value }}
        />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 rounded border border-gray-300 px-1.5 py-0.5 text-xs font-mono"
      />
    </div>
  );
}
