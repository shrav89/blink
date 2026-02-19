import { BrowserWindow } from "electron";

let win: BrowserWindow | null = null;

export function createSettingsWindow() {
  if (win) {
    win.focus();
    return;
  }

  win = new BrowserWindow({
    width: 420,
    height: 520,
    webPreferences: {
      preload: __dirname + "/../preload.js"
    }
  });

  win.loadURL("http://localhost:5173");
  win.on("closed", () => (win = null));
}
