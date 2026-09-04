"use client";

import { useMemo, useRef, useState } from "react";
import { confirmScreenshotGame, parseScreenshots, type ScreenshotEntry } from "@/lib/actions";
import { PlayerBadge } from "@/components/PlayerBadge";

interface EntryState {
  rawName: string;
  victoryPoints: number;
  resolvedName: string;
  isNew: boolean;
}

const NEW_PLAYER = "__new__";

function suggestName(rawName: string) {
  return rawName.split("#")[0].trim() || rawName;
}

function ImagePicker({
  label,
  file,
  onChange,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-ink-900/15 bg-parchment-100/50 text-center transition hover:border-wood-500 hover:bg-parchment-100"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
      ) : (
        <>
          <span className="text-2xl" aria-hidden>
            📸
          </span>
          <p className="px-4 text-xs font-medium text-ink-800/60">{label}</p>
        </>
      )}
    </div>
  );
}

export function ScreenshotForm({ roster, leagueSlug }: { roster: string[]; leagueSlug?: string }) {
  const [step, setStep] = useState<"upload" | "confirm">("upload");
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [entries, setEntries] = useState<EntryState[]>([]);
  const [winner, setWinner] = useState("");

  async function analyze() {
    if (!image1) {
      setError("Add at least the Overview screenshot.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.set("image1", image1);
      if (image2) formData.set("image2", image2);

      const result = await parseScreenshots(formData, leagueSlug);

      const nextEntries: EntryState[] = result.entries.map((e: ScreenshotEntry) => ({
        rawName: e.rawName,
        victoryPoints: e.victoryPoints,
        resolvedName: e.resolvedName ?? "",
        isNew: false,
      }));

      const winnerEntry = nextEntries.find(
        (e) => e.rawName.toLowerCase() === result.winnerRawName.toLowerCase()
      );

      setEntries(nextEntries);
      setWinner(winnerEntry?.resolvedName || "");
      setStep("confirm");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong reading those screenshots.");
    } finally {
      setLoading(false);
    }
  }

  function updateEntry(index: number, patch: Partial<EntryState>) {
    setEntries((prev) => {
      const next = [...prev];
      const before = next[index];
      next[index] = { ...before, ...patch };
      if (winner === before.resolvedName && patch.resolvedName !== undefined) {
        setWinner("");
      }
      return next;
    });
  }

  const resolvedNames = entries.map((e) => e.resolvedName.trim()).filter(Boolean);
  const canConfirm =
    entries.length >= 2 &&
    entries.every((e) => e.resolvedName.trim().length > 0) &&
    new Set(resolvedNames).size === entries.length &&
    winner &&
    resolvedNames.includes(winner);

  async function confirm() {
    if (!canConfirm) return;
    setError(null);
    setLoading(true);
    try {
      await confirmScreenshotGame(
        entries.map((e) => ({ rawName: e.rawName, resolvedName: e.resolvedName.trim() })),
        winner,
        leagueSlug
      );
    } catch (e) {
      if (e instanceof Error) setError(e.message);
      setLoading(false);
    }
  }

  if (step === "upload") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-base font-semibold text-ink-900">
            Upload your Colonist.io results
          </h2>
          <p className="mt-1 text-xs text-ink-800/60">
            The end-game &ldquo;Victory!!!&rdquo; Overview screenshot works best. Add a second
            screenshot (e.g. another stats tab) if the first has a card or popup covering a
            player&rsquo;s row.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ImagePicker label="Overview screenshot" file={image1} onChange={setImage1} />
          <ImagePicker label="Second screenshot (optional)" file={image2} onChange={setImage2} />
        </div>
        {error && (
          <div className="rounded-xl border border-brick-500/30 bg-brick-500/10 px-4 py-3 text-sm font-medium text-brick-700">
            {error}
          </div>
        )}
        <button
          type="button"
          onClick={analyze}
          disabled={!image1 || loading}
          className="w-full rounded-full bg-wood-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-wood-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          {loading ? "Reading screenshots…" : "Analyze Screenshots"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-base font-semibold text-ink-900">Confirm players</h2>
        <p className="mt-1 text-xs text-ink-800/60">
          Match each Colonist.io name to your roster. This mapping is remembered next time.
        </p>
      </div>

      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 rounded-xl border border-ink-900/10 bg-parchment-100/40 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2 text-sm">
              {entry.resolvedName && <PlayerBadge name={entry.resolvedName} size="sm" />}
              <span className="font-medium text-ink-900">{entry.rawName}</span>
              <span className="text-ink-800/50">· {entry.victoryPoints} VP</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={entry.isNew ? NEW_PLAYER : entry.resolvedName}
                onChange={(e) => {
                  if (e.target.value === NEW_PLAYER) {
                    updateEntry(i, { isNew: true, resolvedName: suggestName(entry.rawName) });
                  } else {
                    updateEntry(i, { isNew: false, resolvedName: e.target.value });
                  }
                }}
                className="rounded-full border border-ink-900/15 bg-white px-3 py-1.5 text-sm text-ink-900 focus:border-wood-500 focus:outline-none"
              >
                <option value="">— select player —</option>
                {roster.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
                <option value={NEW_PLAYER}>+ Add new player…</option>
              </select>

              {entry.isNew && (
                <input
                  type="text"
                  value={entry.resolvedName}
                  onChange={(e) => updateEntry(i, { resolvedName: e.target.value })}
                  placeholder="New player name"
                  className="w-36 rounded-full border border-ink-900/15 bg-white px-3 py-1.5 text-sm text-ink-900 placeholder:text-ink-800/40 focus:border-wood-500 focus:outline-none"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-display text-base font-semibold text-ink-900">Who won?</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {resolvedNames.length === 0 && (
            <p className="text-xs text-ink-800/60">Resolve player names above first.</p>
          )}
          {resolvedNames.map((name) => (
            <label
              key={name}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                winner === name
                  ? "border-brick-600 bg-brick-500 text-white shadow-card"
                  : "border-ink-900/10 bg-white text-ink-800 hover:bg-ink-900/5"
              }`}
            >
              <input
                type="radio"
                name="ai-winner"
                value={name}
                checked={winner === name}
                onChange={() => setWinner(name)}
                className="sr-only"
              />
              <PlayerBadge name={name} size="sm" />
              {name}
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-brick-500/30 bg-brick-500/10 px-4 py-3 text-sm font-medium text-brick-700">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={confirm}
          disabled={!canConfirm || loading}
          className="rounded-full bg-wood-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-wood-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? "Saving…" : "Confirm & Save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setStep("upload");
            setEntries([]);
            setWinner("");
            setError(null);
          }}
          className="rounded-full border border-ink-900/15 px-4 py-2 text-sm font-medium text-ink-800 transition hover:bg-ink-900/5"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
