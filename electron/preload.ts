import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("blink", {
  onTimerTick: (cb: (payload: { remainingSec: number }) => void) =>
    ipcRenderer.on("timer:tick", (_e, payload) => cb(payload)),
  skipBreak: () => ipcRenderer.send("blink:skip")
});
