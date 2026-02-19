export type TimerState = "idle" | "work" | "break";
export type MeetingAction = "defer" | "skip";

export interface Settings {
  workMinutes: number;
  breakMinutes: number;
  weekdayOnly: boolean;
  detectMeetings: boolean;
  meetingAction: MeetingAction;
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
