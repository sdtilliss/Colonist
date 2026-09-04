"use client";

import { useState } from "react";
import { createLeagueAction } from "@/lib/actions";

export default function NewLeaguePage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Start a League</h1>
        <p className="mt-1 text-sm text-ink-800/60">
          Give your group its own tracker — separate roster, games, and stats. You&rsquo;ll get a
          shareable link; anyone with it can view and record games.
        </p>
      </div>

      <form
        action={async (formData) => {
          setError(null);
          const name = String(formData.get("name") ?? "").trim();
          if (!name) {
            setError("Give your league a name.");
            return;
          }
          setPending(true);
          try {
            await createLeagueAction(formData);
          } catch (e) {
            if (e instanceof Error) setError(e.message);
            setPending(false);
          }
        }}
        className="space-y-4 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card"
      >
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink-900">
            League name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="e.g. The Thursday Night Crew"
            className="mt-2 w-full rounded-full border border-ink-900/15 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-800/40 focus:border-wood-500 focus:outline-none"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-brick-500/30 bg-brick-500/10 px-4 py-3 text-sm font-medium text-brick-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-wood-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-wood-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Creating…" : "Create League"}
        </button>
      </form>
    </div>
  );
}
