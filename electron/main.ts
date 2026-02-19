import path from "path";
import { app, Tray, Menu, ipcMain } from "electron";
import { createSettingsWindow } from "./windows/settingsWindow";
import { createOverlayWindows, closeOverlayWindows, sendToOverlays } from "./windows/overlayWindow";
import { timerService } from "./services/timerService";
import { getSettings, updateSettings } from "./services/settingsStore";
import { getStats } from "./services/statsStore";
import { TimerState, Settings } from "../shared/types";

let tray: Tray;
let lastState: TimerState = "idle";

app.on("window-all-closed", (e: Event) => e.preventDefault());

app.whenReady().then(() => {
  const iconPath = path.join(__dirname, "..", "assets", "icon.png");
  tray = new Tray(iconPath);
  tray.setToolTip("Blink");

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Open Settings", click: () => createSettingsWindow() },
      { label: "Quit", click: () => app.quit() }
    ])
  );

  timerService.onTick((state, remainingSec) => {
    if (state !== lastState) {
      if (state === "break") createOverlayWindows();
      if (state === "work") closeOverlayWindows();
      lastState = state;
    }

    if (state === "break") {
      sendToOverlays("timer:tick", { remainingSec });
    }
  });

  ipcMain.on("blink:skip", () => timerService.skipBreak());

  ipcMain.handle("blink:settings:get", () => getSettings());
  ipcMain.handle("blink:settings:save", (_e, partial: Partial<Settings>) =>
    updateSettings(partial)
  );
  ipcMain.handle("blink:stats:get", () => getStats());

  timerService.startWork();
});
