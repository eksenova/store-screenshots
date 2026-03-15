"use client";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-xs text-gray-500">{label}</label>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-xs"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
