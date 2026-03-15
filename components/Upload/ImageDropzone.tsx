"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";

interface ImageDropzoneProps {
  onImageLoad: (dataUrl: string, width: number, height: number) => void;
  label?: string;
  compact?: boolean;
}

export function ImageDropzone({ onImageLoad, label = "Drop image or click to upload", compact = false }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => onImageLoad(dataUrl, img.width, img.height);
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    },
    [onImageLoad],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center
        ${isDragging ? "border-indigo-500 bg-indigo-50" : "border-gray-300 hover:border-gray-400 bg-gray-50"}
        ${compact ? "px-3 py-2" : "px-4 py-6"}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processFile(file);
          e.target.value = "";
        }}
        className="hidden"
      />
      <p className={`text-gray-500 ${compact ? "text-xs" : "text-sm"}`}>{label}</p>
    </div>
  );
}
