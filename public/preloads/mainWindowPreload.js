
const {contextBridge, ipcRenderer} = require("electron")
window.ipcRenderer = ipcRenderer
window.contextBridge = contextBridge
contextBridge.exposeInMainWorld("electronAPI", {
    sendTestData: data => ipcRenderer.send('test-data', data),
    getData : callback => ipcRenderer.on('data-received', callback)
})

