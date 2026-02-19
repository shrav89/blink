import type { Settings, StatsData } from "./types";

interface BlinkAPI {
  onTimerTick: (cb: (payload: { remainingSec: number }) => void) => void;
  skipBreak: () => void;
  getSettings: () => Promise<Settings>;
  saveSettings: (partial: Partial<Settings>) => Promise<Settings>;
  getStats: () => Promise<StatsData>;
}

declare global {
  interface Window {
    blink?: BlinkAPI;
  }
}
