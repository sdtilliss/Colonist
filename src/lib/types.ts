export interface Game {
  id: string;
  playedAt: string;
  players: string[];
  winner: string;
}

export interface LegacyBaseline {
  gamesPlayed: number;
  wins: number;
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
  legacyGamesPlayed: number;
}
