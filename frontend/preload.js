const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // Expose Electron-specific APIs if needed
});
