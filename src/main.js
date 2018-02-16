// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path"
import url from "url"
import { app, Menu } from "electron"
import createWindow from "./helpers/window"
import { buildMenu } from "./helpers/menu"

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (NODE_ENV !== "production") {
  const userDataPath = app.getPath("userData")
  app.setPath("userData", `${userDataPath} (${NODE_ENV})`)
}

app.setAboutPanelOptions({
  applicationName: "remix, Electron Edition",
  credits: "Horizon Blockchain Games \n https://horizongames.co",
  copyright: "Remix by https://github.com/ethereum/remix"
})

app.on("ready", () => {
  const mainWindow = createWindow("main", {
    width: 1024
  })

  Menu.setApplicationMenu(Menu.buildFromTemplate(buildMenu(mainWindow)))

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "app/index.html"),
      protocol: "file:",
      slashes: true
    })
  )
})

app.on("window-all-closed", () => {
  app.quit()
})
