"use client";

import { useEffect, useState } from "react";

interface LogEntry {
  id: number;
  type: "error" | "warn" | "log";
  message: string;
  timestamp: string;
}

let logId = 0;

export function ConsoleLogger() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const origError = console.error;
    const origWarn = console.warn;

    const addLog = (type: LogEntry["type"], args: unknown[]) => {
      const message = args.map((a) => {
        if (a instanceof Error) return `${a.message}\n${a.stack}`;
        if (typeof a === "object") try { return JSON.stringify(a, null, 2); } catch { return String(a); }
        return String(a);
      }).join(" ");

      setLogs((prev) => [...prev.slice(-50), {
        id: ++logId,
        type,
        message,
        timestamp: new Date().toLocaleTimeString(),
      }]);
    };

    console.error = (...args: unknown[]) => {
      addLog("error", args);
      origError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      addLog("warn", args);
      origWarn.apply(console, args);
    };

    // Catch unhandled errors
    const handleError = (e: ErrorEvent) => {
      addLog("error", [`Unhandled: ${e.message} at ${e.filename}:${e.lineno}`]);
    };

    const handleRejection = (e: PromiseRejectionEvent) => {
      addLog("error", [`Unhandled Promise: ${e.reason}`]);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      console.error = origError;
      console.warn = origWarn;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  const errorCount = logs.filter((l) => l.type === "error").length;

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className={`fixed bottom-4 left-4 z-50 px-3 py-1.5 rounded-full text-xs font-mono shadow-lg
          ${errorCount > 0 ? "bg-red-600 text-white" : "bg-gray-800 text-gray-300"}`}
      >
        {errorCount > 0 ? `${errorCount} errors` : "console"} {visible ? "▼" : "▲"}
      </button>

      {/* Log panel */}
      {visible && (
        <div className="fixed bottom-12 left-4 z-50 w-[600px] max-h-80 bg-gray-900 text-gray-100 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
          <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800 border-b border-gray-700">
            <span className="text-xs font-mono text-gray-400">Console ({logs.length})</span>
            <button onClick={() => setLogs([])} className="text-xs text-gray-500 hover:text-gray-300">Clear</button>
          </div>
          <div className="overflow-y-auto max-h-64 p-2 space-y-1 font-mono text-[11px]">
            {logs.length === 0 && <p className="text-gray-500">No logs yet</p>}
            {logs.map((log) => (
              <div key={log.id} className={`px-2 py-1 rounded ${
                log.type === "error" ? "bg-red-900/40 text-red-300" :
                log.type === "warn" ? "bg-yellow-900/40 text-yellow-300" :
                "text-gray-400"
              }`}>
                <span className="text-gray-600 mr-2">{log.timestamp}</span>
                <span className="whitespace-pre-wrap break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
