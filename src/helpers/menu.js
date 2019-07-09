import { app, shell, BrowserWindow, BrowserView, dialog } from 'electron'

const pkgJson = require('../../package.json')

function buildMenu(mainWindow) {
  let menu = []


  if (process.platform === 'darwin') {
    menu.push({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  } else {
    menu.push({
      label: 'File',
      submenu: [
        { role: 'quit' }
      ]
    })
  }

  menu.push(...[
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { 
          label: 'Save as...',
          accelerator: 'Shift+CmdOrCtrl+S',
          click: () => {
            const win = BrowserWindow.getFocusedWindow()
            // The data of the file will be always in localStorage and
            // we can get the title of the file by getting the active tab text
            win.webContents.executeJavaScript(`
              ((window) => {
                try {
                  const title = window.document.getElementsByClassName('active')[0].childNodes[4].title;
                  if(title === "Home" || !title) {
                    alert('No file opened')
                  } else {
                    require('electron').ipcRenderer.send('save-file', {title, content: window.localStorage.getItem('sol:' + title)})
                  }
                } catch(err){
                  console.log(err)
                  alert('No file opened')
                }
              })(window)
            `);
          }
        },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { 
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            const win = BrowserWindow.getFocusedWindow()
            dialog.showMessageBox(
              win,
              {
                type: 'warning',
                buttons: ['Cancel', 'Ok'],
                message: 'Do you want to reload the app?',
                detail: 'Changes that you made may not be saved'
              },
              id => {
                // 1 is the index of Ok button, which is the confirmation of reload
                if(id === 1) {
                  win.reload()
                }
              }
            );
          }
        },
        { role: 'forcereload' },
        { role: 'minimize' },
        {
          label: 'Close',
          accelerator: 'Cmd+W',
          click: () => {
            const win = BrowserWindow.getFocusedWindow()
            if (win === null) {
              if (mainWindow.isDevToolsFocused()) {
                mainWindow.closeDevTools()
              }
            } else {
              if (process.platform === 'darwin') {
                app.hide()
              } else {
                win.close()
              }
            }
          }
        }
      ]
    },
    {
      label: 'Inspector',
      submenu: [
        {
          label: 'Toggle DevTools',
          accelerator: 'Alt+CmdOrCtrl+I',
          click: () => {
            BrowserWindow.getFocusedWindow().toggleDevTools();
          }
        }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: () => {
            shell.openExternal(pkgJson.homepage)
          }
        }
      ]
    }
  ])

  return menu
}

export { buildMenu }
