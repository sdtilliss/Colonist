export interface GameStats {
  devCardsBought?: number;
  trades?: number;
}

export interface Game {
  id: string;
  playedAt: string;
  players: string[];
  winner: string;
  /** Optional per-player extras from a Colonist.io stats screenshot, keyed by player name. */
  stats?: Record<string, GameStats>;
}

export interface LegacyBaseline {
  gamesPlayed: number;
  wins: number;
}

export interface LegacyStats {
  totalGames: number;
  players: Record<string, LegacyBaseline>;
}

export interface PlayerStats {
  name: string;
  gamesPlayed: number;
  wins: number;
  winPct: number;
  currentStreak: number;
  longestStreak: number;
  gamesSinceLastWin: number;
  gamesBehind: number;
  lastPlayedAt: string | null;
  form: boolean[];
}
