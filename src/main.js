import path from 'path'
import url from 'url'
import { app, Menu } from 'electron'
import createWindow from './helpers/window'
import { buildMenu } from './helpers/menu'
import { registerAppCache } from './helpers/app_cache'

let userDataPath = app.getPath('userData')
if (NODE_ENV !== 'production') {
  userDataPath = `${userDataPath} (${NODE_ENV})`
  app.setPath('userData', userDataPath)
}

if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'remix-app',
    credits: 'Horizon Blockchain Games \n https://horizongames.co',
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
})

app.on('window-all-closed', () => {
  app.quit()
})
