"use client";

interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function NumberInput({ label, value, min, max, step = 1, unit = "", onChange }: NumberInputProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500 w-12 shrink-0">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded border border-gray-300 px-2 py-1 text-xs font-mono"
      />
      {unit && <span className="text-xs text-gray-400">{unit}</span>}
    </div>
  );
}
