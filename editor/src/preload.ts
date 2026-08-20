import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  selectRepoPath: () => ipcRenderer.invoke('select-repo-path'),
  loadDatabase: (entityType: string) => ipcRenderer.invoke('load-database', entityType),
  saveDatabase: (entityType: string, data: any) => ipcRenderer.invoke('save-database', { entityType, data })
})