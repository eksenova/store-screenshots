"use client";

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors
          ${checked ? "bg-indigo-600" : "bg-gray-300"}`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform mt-0.5
            ${checked ? "translate-x-4 ml-0.5" : "translate-x-0.5"}`}
        />
      </button>
      <span className="text-xs text-gray-600">{label}</span>
    </label>
  );
}
