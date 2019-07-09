import { ipcMain, dialog, BrowserWindow } from 'electron';
import fs from 'fs';

ipcMain.on('save-file', (event, file) => {
  const win = BrowserWindow.getFocusedWindow()
  dialog.showSaveDialog(win, {
    title: 'Save solidity file',
    defaultPath: file.title,
    filters: [{ name: 'Solidity Smart Contract', extensions: ['sol'] }]
  }, (filePath) => {
    if(filePath){
      fs.writeFile(filePath, file.content, (err) => {
        if(err) alert(err);
      })
    }
  });
});

export { saveFile };
