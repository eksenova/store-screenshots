"use client";

import { EditorProvider } from "@/components/EditorProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastProvider } from "@/components/ui/Toast";
import { ConsoleLogger } from "@/components/ConsoleLogger";
import { EditorSidebar } from "@/components/Editor/EditorSidebar";
import { CanvasPreview } from "@/components/Preview/CanvasPreview";

export default function Home() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ConsoleLogger />
        <EditorProvider>
          <main className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white px-6 py-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-lg font-bold text-gray-900">Store Screenshots</h1>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">beta</span>
                </div>
                <nav className="flex items-center gap-4">
                  <a
                    href="https://github.com/eksenova/store-screenshots"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    GitHub
                  </a>
                </nav>
              </div>
            </header>

            {/* Editor */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left: Controls */}
              <div className="border-r border-gray-200 bg-white p-3">
                <EditorSidebar />
              </div>

              {/* Right: Preview */}
              <CanvasPreview />
            </div>
          </main>
        </EditorProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
