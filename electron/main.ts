import { app, Tray, Menu } from "electron";
import { createSettingsWindow } from "./windows/settingsWindow";
import { timerService } from "./services/timerService";

let tray: Tray;

app.whenReady().then(() => {
  tray = new Tray("icon.png");
  tray.setToolTip("Blink");

  tray.setContextMenu(
    Menu.buildFromTemplate([
      { label: "Open Settings", click: () => createSettingsWindow() },
      { label: "Quit", click: () => app.quit() }
    ])
  );

  timerService.startWork();
});
