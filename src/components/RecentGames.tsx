import type { Game } from "@/lib/types";
import { PlayerBadge } from "./PlayerBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function RecentGames({ games }: { games: Game[] }) {
  const recent = [...games]
    .sort((a, b) => new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime())
    .slice(0, 8);

  return (
    <div className="rounded-2xl border border-ink-900/10 bg-white p-4 shadow-card">
      <h3 className="font-display text-base font-semibold text-ink-900">Recent Games</h3>
      <ul className="mt-3 space-y-3">
        {recent.map((g) => (
          <li key={g.id} className="flex items-start justify-between gap-3 border-b border-ink-900/5 pb-3 last:border-0 last:pb-0">
            <div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
                <PlayerBadge name={g.winner} size="sm" highlighted />
                {g.winner} won
              </div>
              <p className="mt-1 text-xs text-ink-800/60">
                vs {g.players.filter((p) => p !== g.winner).join(", ") || "—"}
              </p>
            </div>
            <span className="whitespace-nowrap text-xs text-ink-800/50">{formatDate(g.playedAt)}</span>
          </li>
        ))}
        {recent.length === 0 && (
          <p className="text-sm text-ink-800/60">No games recorded yet.</p>
        )}
      </ul>
    </div>
  );
}
