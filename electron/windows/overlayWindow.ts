import { BrowserWindow, screen } from "electron";

let overlays: BrowserWindow[] = [];

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
        preload: __dirname + "/../preload.js",
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    win.setAlwaysOnTop(true, "screen-saver");
    win.loadURL("http://localhost:5173/#/overlay");
    return win;
  });
}

export function closeOverlayWindows() {
  overlays.forEach(w => {
    if (!w.isDestroyed()) w.close();
  });
  overlays = [];
}

export function sendToOverlays(channel: string, payload: any) {
  overlays.forEach(w => {
    if (!w.isDestroyed()) w.webContents.send(channel, payload);
  });
}
