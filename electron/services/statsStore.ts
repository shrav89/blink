import { app } from "electron";
import fs from "fs";
import path from "path";
import type { DayStats, StatsData } from "../../shared/types";

let filePath: string | null = null;
let days: DayStats[] = [];

function init() {
  if (filePath) return;
  filePath = path.join(app.getPath("userData"), "stats.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    days = JSON.parse(raw);
  } catch {
    days = [];
  }
}

function save() {
  init();
  fs.writeFileSync(filePath!, JSON.stringify(days, null, 2));
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function getOrCreateToday(): DayStats {
  init();
  const d = today();
  let entry = days.find(e => e.date === d);
  if (!entry) {
    entry = { date: d, breaksTaken: 0, focusMinutes: 0 };
    days.push(entry);
  }
  return entry;
}

export function recordBreak() {
  const entry = getOrCreateToday();
  entry.breaksTaken++;
  save();
}

export function addFocusMinutes(min: number) {
  const entry = getOrCreateToday();
  entry.focusMinutes += min;
  save();
}

function calcStreak(): number {
  init();
  if (days.length === 0) return 0;

  const sorted = [...days]
    .filter(d => d.breaksTaken > 0 || d.focusMinutes > 0)
    .sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) return 0;

  let streak = 0;
  const cursor = new Date(today() + "T00:00:00");

  // If today has no activity, start from yesterday
  if (sorted[0].date !== today()) {
    cursor.setDate(cursor.getDate() - 1);
  }

  for (let i = 0; i < 365; i++) {
    const dateStr = cursor.toISOString().slice(0, 10);
    if (sorted.find(d => d.date === dateStr)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function getStats(): StatsData {
  init();
  return { days, currentStreak: calcStreak() };
}
