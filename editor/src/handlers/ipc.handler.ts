import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import * as fs from 'fs'
const __dirname = dirname(fileURLToPath(import.meta.url))
let repoPath = ''

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, '../src/preload.js'),
      sandbox: false
    }
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('select-repo-path', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory'],
    title: 'Select Inner Demons Repository Root'
  })

  if (!result.canceled && result.filePaths.length > 0) {
    repoPath = result.filePaths[0]
    const gameDir = join(repoPath, 'game')
    return { 
      success: true, 
      path: repoPath, 
      hasGameFolder: fs.existsSync(gameDir) 
    }
  }
  return { success: false }
})

ipcMain.handle('load-database', async (_, entityType: string) => {
  if (!repoPath) throw new Error('Repository path not configured.')
  
  const filePath = join(repoPath, 'game', `${entityType}.json`)
  if (!fs.existsSync(filePath)) return null

  const fileData = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(fileData)
})

interface SaveDatabasePayload {
  entityType: string;
  data: any;
}

ipcMain.handle('save-database', async (_, { entityType, data }: SaveDatabasePayload) => {
  if (!repoPath) throw new Error('Repository path not configured.')

  const filePath = join(repoPath, 'game', `${entityType}.json`)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  
  return true
})

app.whenReady().then(createWindow)