"use client";

import { useMemo, useState } from "react";
import { recordGame } from "@/lib/actions";
import { PlayerBadge } from "@/components/PlayerBadge";

export function RecordForm({ roster }: { roster: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [winner, setWinner] = useState<string>("");
  const [newPlayer, setNewPlayer] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<string[]>(roster);

  const canSubmit = selected.length >= 2 && winner && selected.includes(winner);

  const sortedSelected = useMemo(
    () => [...selected].sort((a, b) => a.localeCompare(b)),
    [selected]
  );

  function togglePlayer(name: string) {
    setSelected((prev) => {
      const next = prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name];
      if (winner && !next.includes(winner)) setWinner("");
      return next;
    });
  }

  function addNewPlayer() {
    const name = newPlayer.trim();
    if (!name) return;
    if (!players.includes(name)) setPlayers((prev) => [...prev, name].sort((a, b) => a.localeCompare(b)));
    if (!selected.includes(name)) setSelected((prev) => [...prev, name]);
    setNewPlayer("");
  }

  return (
    <form
      action={async (formData) => {
        setError(null);
        if (!canSubmit) {
          setError("Select at least two players and a winner among them.");
          return;
        }
        setPending(true);
        await recordGame(formData);
      }}
      className="space-y-8"
    >
      <div>
        <h2 className="font-display text-base font-semibold text-ink-900">Who played?</h2>
        <p className="mt-1 text-xs text-ink-800/60">Select everyone at the table.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {players.map((name) => {
            const active = selected.includes(name);
            return (
              <label
                key={name}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "border-wood-600 bg-wood-500/10 text-wood-700"
                    : "border-ink-900/10 bg-white text-ink-800 hover:bg-ink-900/5"
                }`}
              >
                <input
                  type="checkbox"
                  name="players"
                  value={name}
                  checked={active}
                  onChange={() => togglePlayer(name)}
                  className="sr-only"
                />
                <PlayerBadge name={name} size="sm" />
                {name}
              </label>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNewPlayer();
              }
            }}
            placeholder="Add a new player…"
            className="w-48 rounded-full border border-ink-900/15 bg-white px-3 py-1.5 text-sm text-ink-900 placeholder:text-ink-800/40 focus:border-wood-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={addNewPlayer}
            className="rounded-full border border-ink-900/15 bg-white px-3 py-1.5 text-sm font-medium text-ink-800 transition hover:bg-ink-900/5"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-display text-base font-semibold text-ink-900">Who won?</h2>
        <p className="mt-1 text-xs text-ink-800/60">
          {sortedSelected.length ? "Pick the victor." : "Select players above first."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {sortedSelected.map((name) => (
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
                name="winner"
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

      <button
        type="submit"
        disabled={!canSubmit || pending}
        className="w-full rounded-full bg-wood-500 px-5 py-3 text-sm font-semibold text-white shadow-card transition hover:bg-wood-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {pending ? "Saving…" : "Save Game"}
      </button>
    </form>
  );
}
