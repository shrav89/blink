import path from "path";
import { BrowserWindow } from "electron";

let win: BrowserWindow | null = null;

export function createSettingsWindow() {
  if (win) {
    win.focus();
    return;
  }

  win = new BrowserWindow({
    width: 420,
    height: 660,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL("http://localhost:5173");
  win.on("closed", () => (win = null));
}
