import path from 'path'
import url from 'url'
import { app, Menu } from 'electron'
import createWindow from './helpers/window'
import { buildMenu } from './helpers/menu'
import { registerAppCache } from './helpers/app_cache'

// This line will just execute the listeners for the saving file process
// import './helpers/file-manager'

let userDataPath = app.getPath('userData')
if (NODE_ENV !== 'production') {
  userDataPath = `${userDataPath} (${NODE_ENV})`
  app.setPath('userData', userDataPath)
}

if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'remix-app',
    credits: 'Horizon Blockchain Games \n https://horizongames.net',
    copyright: 'Remix by https://github.com/ethereum/remix'
  })
}

app.on('ready', () => {
  const mainWindow = createWindow('main', {
    width: 1024
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenu(mainWindow)))

  // Register app cache on the main window's network stack
  registerAppCache(mainWindow, userDataPath)

  // Load the local static app
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, 'app/index.html'),
      protocol: 'file:',
      slashes: true
    })
  )

  // Work-around for electron/chrome 51+ onbeforeunload behavior
  // which prevents the app window to close if not invalidated.
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript("window.onbeforeunload = null")
  })
})

app.on('window-all-closed', () => {
  app.quit()
})
