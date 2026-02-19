export type TimerState = "idle" | "work" | "break";

export interface Settings {
  workMinutes: number;
  breakMinutes: number;
  weekdayOnly: boolean;
}

export interface DayStats {
  date: string;
  breaksTaken: number;
  focusMinutes: number;
}

export interface StatsData {
  days: DayStats[];
  currentStreak: number;
}
