const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  closeWidget: () => ipcRenderer.send("close-widget"),
  openExternalLink: () => ipcRenderer.send("open-external-link"),
  setAlwaysOnTop: (isAlwaysOnTop) => ipcRenderer.send("set-always-on-top", isAlwaysOnTop),
  getAlwaysOnTop: () => ipcRenderer.invoke("get-always-on-top")
});
