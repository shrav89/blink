import path from "path";
import { app, Tray, Menu } from "electron";
import { createSettingsWindow } from "./windows/settingsWindow";
import { timerService } from "./services/timerService";

let tray: Tray;

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

  timerService.startWork();
});
