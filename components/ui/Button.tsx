"use client";

import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 active:bg-gray-100",
  ghost: "text-gray-600 hover:bg-gray-100 active:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
  lg: "px-4 py-2 text-base",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({ variant = "secondary", size = "md", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors
        disabled:opacity-50 disabled:pointer-events-none
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    />
  );
}
