import { contextBridge, ipcRenderer } from "electron";
import type { Settings } from "../shared/types";

contextBridge.exposeInMainWorld("blink", {
  onTimerTick: (cb: (payload: { remainingSec: number }) => void) =>
    ipcRenderer.on("timer:tick", (_e, payload) => cb(payload)),
  skipBreak: () => ipcRenderer.send("blink:skip"),
  getSettings: () => ipcRenderer.invoke("blink:settings:get"),
  saveSettings: (partial: Partial<Settings>) =>
    ipcRenderer.invoke("blink:settings:save", partial),
  getStats: () => ipcRenderer.invoke("blink:stats:get")
});
