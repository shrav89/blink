import { DEFAULTS } from "../../shared/constants";

let settings = { ...DEFAULTS };

export function getSettings() {
  return settings;
}

export function updateSettings(partial: Partial<typeof settings>) {
  settings = { ...settings, ...partial };
}
