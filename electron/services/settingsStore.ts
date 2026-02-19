import { app } from "electron";
import fs from "fs";
import path from "path";
import { DEFAULTS } from "../../shared/constants";
import type { Settings } from "../../shared/types";

let filePath: string | null = null;
let settings: Settings = { ...DEFAULTS };

function init() {
  if (filePath) return;
  filePath = path.join(app.getPath("userData"), "settings.json");
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    settings = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    settings = { ...DEFAULTS };
  }
}

function save() {
  init();
  fs.writeFileSync(filePath!, JSON.stringify(settings, null, 2));
}

export function getSettings(): Settings {
  init();
  return settings;
}

export function updateSettings(partial: Partial<Settings>): Settings {
  init();
  settings = { ...settings, ...partial };
  save();
  return settings;
}
