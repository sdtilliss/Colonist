"use client";

import { useEffect } from "react";
import { HexBoard } from "@/components/HexBoard";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <HexBoard className="mx-auto h-28 w-28" />
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-ink-800/60">
          That was a one-off hiccup, not a broken link. Try again — if it keeps happening,
          mention the code below.
        </p>
        {error.digest && (
          <p className="mt-2 font-mono text-xs text-ink-800/40">Code: {error.digest}</p>
        )}
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex items-center gap-2 rounded-full bg-brick-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brick-600"
      >
        Try again
      </button>
    </div>
  );
}
