import Link from "next/link";
import { getGames, getLegacyStats } from "@/lib/store";
import { computeStats, computeLeagueSummary, computeFunStats } from "@/lib/stats";
import { Leaderboard } from "@/components/Leaderboard";
import { RecentGames } from "@/components/RecentGames";
import { StatCard } from "@/components/StatCard";
import { HexBoard } from "@/components/HexBoard";

export async function DashboardView({
  leagueSlug,
  leagueName,
  since,
  recorded,
}: {
  leagueSlug?: string;
  leagueName: string;
  since: string;
  recorded?: string;
}) {
  const games = await getGames(leagueSlug);
  const legacy = getLegacyStats(leagueSlug);
  const stats = computeStats(games, legacy.players);
  const summary = computeLeagueSummary(games, stats, legacy.totalGames);
  const funStats = computeFunStats(games);
  const hasFunStats = funStats.mostDevCards || funStats.mostTrades;
  const lastGame = games[games.length - 1] ?? null;
  const lastGameDate = lastGame
    ? new Date(lastGame.playedAt).toLocaleDateString("en-US", {
        timeZone: "UTC",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const base = leagueSlug ? `/l/${leagueSlug}` : "";

  return (
    <div className="space-y-8">
      {recorded && (
        <div className="rounded-xl border border-wood-500/30 bg-wood-500/10 px-4 py-3 text-sm font-medium text-wood-700">
          Game recorded. The board has been updated.
        </div>
      )}

      <section className="relative overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-lift">
        <div className="grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-10">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-brick-600">
              Season standings
            </p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
              {leagueName}
            </h1>
            <p className="mt-3 max-w-lg text-sm text-ink-800/70 sm:text-base">{since}</p>
            <Link
              href={`${base}/record`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-brick-500 px-5 py-2.5 text-sm font-semibold text-white shadow-card transition hover:bg-brick-600"
            >
              Record a Game
            </Link>
          </div>
          <HexBoard className="h-40 w-40 justify-self-center sm:h-48 sm:w-48" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total Games" value={summary.totalGames} accent="wood" />
        <StatCard label="Players" value={summary.totalPlayers} accent="ore" />
        <StatCard
          label="Reigning Champion"
          value={lastGame ? lastGame.winner : "—"}
          sub={lastGame ? `won on ${lastGameDate}` : "No games yet"}
          accent="brick"
        />
        <StatCard
          label="Hottest Streak"
          value={summary.hottestStreak ? `${summary.hottestStreak.name} × ${summary.hottestStreak.currentStreak}` : "—"}
          sub={summary.hottestStreak ? "current win streak" : "no active streaks"}
          accent="wheat"
        />
      </section>

      {hasFunStats && (
        <section className="grid grid-cols-2 gap-4">
          <StatCard
            label="Most Dev Cards Bought"
            value={funStats.mostDevCards ? funStats.mostDevCards.name : "—"}
            sub={funStats.mostDevCards ? `${funStats.mostDevCards.total} total` : undefined}
            accent="sheep"
          />
          <StatCard
            label="Most Active Trader"
            value={funStats.mostTrades ? funStats.mostTrades.name : "—"}
            sub={funStats.mostTrades ? `${funStats.mostTrades.total} trades` : undefined}
            accent="teal"
          />
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="mb-3 font-display text-lg font-semibold text-ink-900">Leaderboard</h2>
          <Leaderboard stats={stats} />
        </div>
        <RecentGames games={games} />
      </section>
    </div>
  );
}
