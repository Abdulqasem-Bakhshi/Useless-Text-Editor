const { contextBridge, ipcRenderer} = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const { webFrame } = require('electron');

  // Disable zooming in the webview
webFrame.setZoomLevel(0); // Default zoom level is 0
webFrame.setVisualZoomLevelLimits(1, 1,); // Disable pinch zooming
})

contextBridge.exposeInMainWorld('electronAPI', {
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  closeWindow: () => ipcRenderer.send('close-window'),
});