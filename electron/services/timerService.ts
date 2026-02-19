import { getSettings } from "./settingsStore";
import { addFocusMinutes, recordBreak } from "./statsStore";
import { TimerState } from "../../shared/types";

type Listener = (state: TimerState, remainingSec: number) => void;

class TimerService {
  private state: TimerState = "idle";
  private remainingSec = 0;
  private interval: NodeJS.Timeout | null = null;
  private listeners: Listener[] = [];

  startWork() {
    const { workMinutes } = getSettings();
    this.start("work", workMinutes * 60);
  }

  startBreak() {
    const { breakMinutes } = getSettings();
    this.start("break", breakMinutes * 60);
  }

  skipBreak() {
    this.startWork();
  }

  onTick(fn: Listener) {
    this.listeners.push(fn);
  }

  private start(state: TimerState, seconds: number) {
    this.state = state;
    this.remainingSec = seconds;
    this.emit();

    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.remainingSec--;
      this.emit();

      if (this.remainingSec <= 0) {
        clearInterval(this.interval!);
        if (this.state === "work") {
          const { workMinutes } = getSettings();
          addFocusMinutes(workMinutes);
          this.startBreak();
        } else {
          recordBreak();
          this.startWork();
        }
      }
    }, 1000);
  }

  private emit() {
    this.listeners.forEach(fn => fn(this.state, this.remainingSec));
  }
}

export const timerService = new TimerService();
