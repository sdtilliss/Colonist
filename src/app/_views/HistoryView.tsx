import { getGames, getRoster } from "@/lib/store";
import { HistoryTable } from "@/app/history/HistoryTable";

export async function HistoryView({ leagueSlug }: { leagueSlug?: string }) {
  const games = await getGames(leagueSlug);
  const roster = await getRoster(leagueSlug);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Game History</h1>
        <p className="mt-1 text-sm text-ink-800/60">
          Every recorded game, newest first. Filter by player to relive their highlights (or lowlights).
        </p>
      </div>
      <HistoryTable games={games} roster={roster} />
    </div>
  );
}
