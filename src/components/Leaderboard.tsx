"use client";

import { useMemo, useState } from "react";
import type { PlayerStats } from "@/lib/types";
import { PlayerBadge } from "./PlayerBadge";

type SortKey =
  | "name"
  | "winPct"
  | "wins"
  | "gamesPlayed"
  | "gamesBehind"
  | "currentStreak"
  | "gamesSinceLastWin";

function Form({ form }: { form: boolean[] }) {
  return (
    <div className="flex items-center gap-1">
      {form.length === 0 && <span className="text-ink-800/40">—</span>}
      {form.map((won, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${won ? "bg-wood-500" : "bg-ink-900/15"}`}
          title={won ? "Win" : "Loss"}
        />
      ))}
    </div>
  );
}

function SortHeader({
  label,
  sortKey,
  activeKey,
  dir,
  onSort,
  align = "right",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sortKey === activeKey;
  return (
    <th className={`px-4 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={`inline-flex items-center gap-1 transition hover:text-ink-900 ${
          align === "right" ? "flex-row-reverse" : ""
        } ${active ? "text-ink-900" : ""}`}
      >
        {label}
        <span className="w-2.5 text-[10px] leading-none text-ink-800/50">
          {active ? (dir === "asc" ? "▲" : "▼") : ""}
        </span>
      </button>
    </th>
  );
}

export function Leaderboard({ stats }: { stats: PlayerStats[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("winPct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  const sorted = useMemo(() => {
    const dirMult = sortDir === "asc" ? 1 : -1;
    return [...stats].sort((a, b) => {
      if (sortKey === "name") return a.name.localeCompare(b.name) * dirMult;
      return (a[sortKey] - b[sortKey]) * dirMult;
    });
  }, [stats, sortKey, sortDir]);

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 bg-parchment-100/70 text-left text-xs uppercase tracking-wide text-ink-800/60">
              <SortHeader label="Player" sortKey="name" activeKey={sortKey} dir={sortDir} onSort={handleSort} align="left" />
              <SortHeader label="Win %" sortKey="winPct" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Wins" sortKey="wins" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Games" sortKey="gamesPlayed" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Wins Behind" sortKey="gamesBehind" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader label="Streak" sortKey="currentStreak" activeKey={sortKey} dir={sortDir} onSort={handleSort} />
              <SortHeader
                label="Since Last Win"
                sortKey="gamesSinceLastWin"
                activeKey={sortKey}
                dir={sortDir}
                onSort={handleSort}
              />
              <th className="px-4 py-3 font-medium">Form</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr
                key={s.name}
                className="border-b border-ink-900/5 last:border-0 hover:bg-parchment-100/40"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium text-ink-900">
                    <PlayerBadge name={s.name} />
                    {s.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink-900">
                  {s.winPct.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">{s.wins}</td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">{s.gamesPlayed}</td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                  {s.gamesBehind === 0 ? (
                    <span className="font-medium text-wood-600">Most wins</span>
                  ) : (
                    `-${s.gamesBehind}`
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                  {s.currentStreak > 0 ? (
                    <span className="inline-flex items-center gap-1 font-medium text-brick-600">
                      {s.currentStreak}🔥
                    </span>
                  ) : (
                    <span className="text-ink-800/40">0</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                  {s.gamesSinceLastWin}
                </td>
                <td className="px-4 py-3">
                  <Form form={s.form} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
