import type { PlayerStats } from "@/lib/types";
import { PlayerBadge } from "./PlayerBadge";

function rankLabel(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `${rank}`;
}

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

export function Leaderboard({ stats }: { stats: PlayerStats[] }) {
  const hasLegacy = stats.some((s) => s.legacyGamesPlayed > 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-900/10 bg-parchment-100/70 text-left text-xs uppercase tracking-wide text-ink-800/60">
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Player</th>
              <th className="px-4 py-3 font-medium text-right">Win %</th>
              <th className="px-4 py-3 font-medium text-right">Wins</th>
              <th className="px-4 py-3 font-medium text-right">Games</th>
              <th className="px-4 py-3 font-medium text-right">Wins Behind</th>
              <th className="px-4 py-3 font-medium text-right">Streak</th>
              <th className="px-4 py-3 font-medium text-right">Since Last Win</th>
              <th className="px-4 py-3 font-medium">Form</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr
                key={s.name}
                className="border-b border-ink-900/5 last:border-0 hover:bg-parchment-100/40"
              >
                <td className="px-4 py-3 text-base">{rankLabel(i + 1)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium text-ink-900">
                    <PlayerBadge name={s.name} highlighted={i === 0} />
                    {s.name}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-ink-900">
                  {s.winPct.toFixed(1)}%
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">{s.wins}</td>
                <td className="px-4 py-3 text-right tabular-nums text-ink-800">
                  {s.gamesPlayed}
                  {s.legacyGamesPlayed > 0 && (
                    <span
                      className="ml-0.5 text-ink-800/40"
                      title={`Includes ${s.legacyGamesPlayed} legacy games from before per-game tracking began`}
                    >
                      *
                    </span>
                  )}
                </td>
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
      {hasLegacy && (
        <p className="border-t border-ink-900/5 px-4 py-2 text-xs text-ink-800/50">
          * Win %, Wins, and Games include pre-2024 legacy totals. Streak and Form reflect
          logged games only.
        </p>
      )}
    </div>
  );
}
