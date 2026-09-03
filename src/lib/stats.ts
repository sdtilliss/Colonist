import type { Game, LegacyBaseline, PlayerStats } from "./types";

export function computeStats(
  games: Game[],
  legacyBaseline: Record<string, LegacyBaseline> = {}
): PlayerStats[] {
  const sorted = [...games].sort(
    (a, b) => new Date(a.playedAt).getTime() - new Date(b.playedAt).getTime()
  );

  const byPlayer = new Map<string, Game[]>();
  const track = (name: string, game: Game) => {
    if (!byPlayer.has(name)) byPlayer.set(name, []);
    byPlayer.get(name)!.push(game);
  };

  sorted.forEach((game) => {
    game.players.forEach((p) => track(p, game));
    if (!game.players.includes(game.winner)) track(game.winner, game);
  });

  Object.keys(legacyBaseline).forEach((name) => {
    if (!byPlayer.has(name)) byPlayer.set(name, []);
  });

  const stats: Omit<PlayerStats, "gamesBehind">[] = [];

  for (const [name, playerGames] of byPlayer.entries()) {
    const legacy = legacyBaseline[name];
    const legacyGamesPlayed = legacy?.gamesPlayed ?? 0;
    const legacyWins = legacy?.wins ?? 0;

    const gamesPlayed = playerGames.length + legacyGamesPlayed;
    const wins = playerGames.filter((g) => g.winner === name).length + legacyWins;
    const winPct = gamesPlayed ? (wins / gamesPlayed) * 100 : 0;

    let currentStreak = 0;
    for (let i = playerGames.length - 1; i >= 0; i--) {
      if (playerGames[i].winner === name) currentStreak++;
      else break;
    }

    let longestStreak = 0;
    let run = 0;
    for (const g of playerGames) {
      if (g.winner === name) {
        run++;
        longestStreak = Math.max(longestStreak, run);
      } else {
        run = 0;
      }
    }

    const reversed = [...playerGames].reverse();
    const lastWinIdx = reversed.findIndex((g) => g.winner === name);
    const gamesSinceLastWin = lastWinIdx === -1 ? playerGames.length : lastWinIdx;

    const lastPlayedAt = playerGames[playerGames.length - 1]?.playedAt ?? null;
    const form = playerGames.slice(-5).map((g) => g.winner === name);

    stats.push({
      name,
      gamesPlayed,
      wins,
      winPct,
      currentStreak,
      longestStreak,
      gamesSinceLastWin,
      lastPlayedAt,
      form,
      legacyGamesPlayed,
    });
  }

  const maxWins = stats.reduce((m, s) => Math.max(m, s.wins), 0);

  return stats
    .map((s) => ({ ...s, gamesBehind: maxWins - s.wins }))
    .sort((a, b) => b.winPct - a.winPct || b.wins - a.wins || a.name.localeCompare(b.name));
}

export interface LeagueSummary {
  totalGames: number;
  totalPlayers: number;
  champion: PlayerStats | null;
  hottestStreak: PlayerStats | null;
}

export function computeLeagueSummary(games: Game[], stats: PlayerStats[]): LeagueSummary {
  const eligible = stats.filter((s) => s.gamesPlayed >= 3);
  const champion = (eligible.length ? eligible : stats).reduce<PlayerStats | null>(
    (best, s) => (!best || s.winPct > best.winPct ? s : best),
    null
  );
  const hottestStreak = stats.reduce<PlayerStats | null>(
    (best, s) => (!best || s.currentStreak > best.currentStreak ? s : best),
    null
  );

  return {
    totalGames: games.length,
    totalPlayers: stats.length,
    champion,
    hottestStreak: hottestStreak && hottestStreak.currentStreak > 0 ? hottestStreak : null,
  };
}
