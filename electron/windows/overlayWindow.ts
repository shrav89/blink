import path from "path";
import { BrowserWindow, screen } from "electron";

let overlays: BrowserWindow[] = [];
let isForcingFocus = false;
let focusIntervals: NodeJS.Timeout[] = [];

export function createOverlayWindows() {
  closeOverlayWindows();
  const displays = screen.getAllDisplays();

  overlays = displays.map(display => {
    const win = new BrowserWindow({
      x: display.bounds.x,
      y: display.bounds.y,
      width: display.bounds.width,
      height: display.bounds.height,
      frame: false,
      fullscreen: true,
      alwaysOnTop: true,
      skipTaskbar: true,
      focusable: true,
      resizable: false,
      movable: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    win.setAlwaysOnTop(true, "screen-saver");

    win.on("blur", () => {
      if (isForcingFocus && !win.isDestroyed()) {
        win.focus();
        win.moveTop();
      }
    });

    win.on("close", (e) => {
      if (isForcingFocus) {
        e.preventDefault();
      }
    });

    const interval = setInterval(() => {
      if (isForcingFocus && !win.isDestroyed() && !win.isFocused()) {
        win.focus();
        win.moveTop();
      }
    }, 500);
    focusIntervals.push(interval);

    win.loadURL("http://localhost:5173/#/overlay");
    return win;
  });
}

export function closeOverlayWindows() {
  focusIntervals.forEach(id => clearInterval(id));
  focusIntervals = [];
  overlays.forEach(w => {
    if (!w.isDestroyed()) w.close();
  });
  overlays = [];
}

export function setFocusEnforcement(active: boolean) {
  isForcingFocus = active;
  if (!active) {
    focusIntervals.forEach(id => clearInterval(id));
    focusIntervals = [];
  }
}

export function forceKillOverlays() {
  isForcingFocus = false;
  focusIntervals.forEach(id => clearInterval(id));
  focusIntervals = [];
  overlays.forEach(w => {
    if (!w.isDestroyed()) w.destroy();
  });
  overlays = [];
}

export function sendToOverlays(channel: string, payload: any) {
  overlays.forEach(w => {
    if (!w.isDestroyed()) w.webContents.send(channel, payload);
  });
}
