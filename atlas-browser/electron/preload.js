const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Додамо функції для взаємодії з AI та браузером
  loadURL: (url) => ipcRenderer.send('load-url', url),
  goBack: () => ipcRenderer.send('go-back'),
  goForward: () => ipcRenderer.send('go-forward'),
  reload: () => ipcRenderer.send('reload'),

  // Функції для AI
  summarizePage: (content) => ipcRenderer.invoke('summarize-page', content),
});