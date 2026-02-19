import path from "path";
import { app, Tray, Menu, ipcMain } from "electron";
import { createSettingsWindow } from "./windows/settingsWindow";
import { createOverlayWindows, closeOverlayWindows, sendToOverlays, setFocusEnforcement, forceKillOverlays } from "./windows/overlayWindow";
import { timerService } from "./services/timerService";
import { getSettings, updateSettings } from "./services/settingsStore";
import { getStats } from "./services/statsStore";
import { startPolling, stopPolling, isInMeeting } from "./services/meetingDetector";
import { TimerState, Settings } from "../shared/types";

let tray: Tray;
let lastState: TimerState = "idle";
let watchdogTimer: NodeJS.Timeout | null = null;
let deferralCheckInterval: NodeJS.Timeout | null = null;
let deferralTimeout: NodeJS.Timeout | null = null;

function cleanupDeferral() {
  if (deferralCheckInterval) {
    clearInterval(deferralCheckInterval);
    deferralCheckInterval = null;
  }
  if (deferralTimeout) {
    clearTimeout(deferralTimeout);
    deferralTimeout = null;
  }
}

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
      if (state === "break") {
        cleanupDeferral();
        const settings = getSettings();

        if (settings.detectMeetings && isInMeeting()) {
          if (settings.meetingAction === "skip") {
            timerService.skipBreak();
            lastState = "work";
            return;
          }
          // defer mode: restart work timer, poll until meeting ends
          timerService.skipBreak();
          lastState = "work";
          deferralCheckInterval = setInterval(() => {
            if (!isInMeeting()) {
              cleanupDeferral();
              timerService.startBreak();
            }
          }, 5000);
          deferralTimeout = setTimeout(() => {
            cleanupDeferral();
          }, 30 * 60 * 1000);
          return;
        }

        createOverlayWindows();
        setFocusEnforcement(true);
        const { breakMinutes } = getSettings();
        if (watchdogTimer) clearTimeout(watchdogTimer);
        watchdogTimer = setTimeout(() => {
          forceKillOverlays();
          timerService.skipBreak();
        }, (breakMinutes * 60 + 60) * 1000);
      }
      if (state === "work") {
        if (watchdogTimer) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
        setFocusEnforcement(false);
        closeOverlayWindows();
      }
      lastState = state;
    }

    if (state === "break") {
      sendToOverlays("timer:tick", { remainingSec });
    }
  });

  ipcMain.on("blink:skip", () => timerService.skipBreak());

  ipcMain.handle("blink:settings:get", () => getSettings());
  ipcMain.handle("blink:settings:save", (_e, partial: Partial<Settings>) => {
    const updated = updateSettings(partial);
    if ("detectMeetings" in partial) {
      if (updated.detectMeetings) {
        startPolling();
      } else {
        stopPolling();
        cleanupDeferral();
      }
    }
    return updated;
  });
  ipcMain.handle("blink:stats:get", () => getStats());

  if (getSettings().detectMeetings) {
    startPolling();
  }

  timerService.startWork();
});
