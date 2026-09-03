"use client";

import { useMemo, useState } from "react";
import type { Game } from "@/lib/types";
import { PlayerBadge, PlayerChip } from "@/components/PlayerBadge";

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function HistoryTable({ games, roster }: { games: Game[]; roster: string[] }) {
  const [filter, setFilter] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...games].sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime()),
    [games]
  );

  const filtered = filter ? sorted.filter((g) => g.players.includes(filter) || g.winner === filter) : sorted;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter(null)}
          className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
            filter === null
              ? "border-ink-900 bg-ink-900 text-white"
              : "border-ink-900/10 bg-white text-ink-800 hover:bg-ink-900/5"
          }`}
        >
          Everyone
        </button>
        {roster.map((name) => (
          <button key={name} onClick={() => setFilter(name)}>
            <PlayerChip name={name} active={filter === name} />
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-ink-900/10 bg-parchment-100/70 text-left text-xs uppercase tracking-wide text-ink-800/60">
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Winner</th>
                <th className="px-4 py-3 font-medium">Players</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} className="border-b border-ink-900/5 last:border-0 hover:bg-parchment-100/40">
                  <td className="whitespace-nowrap px-4 py-3 text-ink-800/70">{formatDateTime(g.playedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-ink-900">
                      <PlayerBadge name={g.winner} size="sm" highlighted />
                      {g.winner}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-800/70">{g.players.join(", ")}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink-800/60">
                    No games found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
