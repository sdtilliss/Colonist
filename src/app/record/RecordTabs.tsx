"use client";

import { useState } from "react";
import { RecordForm } from "./RecordForm";
import { ScreenshotForm } from "./ScreenshotForm";

export function RecordTabs({ roster }: { roster: string[] }) {
  const [mode, setMode] = useState<"manual" | "ai">("ai");

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-full border border-ink-900/10 bg-parchment-100/70 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setMode("ai")}
          className={`rounded-full px-4 py-1.5 transition ${
            mode === "ai" ? "bg-white text-ink-900 shadow-card" : "text-ink-800/60 hover:text-ink-900"
          }`}
        >
          AI Screenshot
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`rounded-full px-4 py-1.5 transition ${
            mode === "manual" ? "bg-white text-ink-900 shadow-card" : "text-ink-800/60 hover:text-ink-900"
          }`}
        >
          Manual
        </button>
      </div>

      {mode === "ai" ? <ScreenshotForm roster={roster} /> : <RecordForm roster={roster} />}
    </div>
  );
}
