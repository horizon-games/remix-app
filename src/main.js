// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path"
import url from "url"
import { app, session, Menu } from "electron"
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


  // Increase cache times to 1 year for solc bin compilers.
  const filter = {
    urls: ["https://ethereum.github.io/solc-bin/bin/soljson-*"]
  }

  session.defaultSession.webRequest.onHeadersReceived(filter, (details, callback) => {
    const respHeaders = details.responseHeaders

    let nRespHeaders = {
      ...respHeaders,
      'cache-control': ['max-age=31540000']
    }
    delete nRespHeaders.expires

    callback({
      cancel: false,
      responseHeaders: nRespHeaders
    })
  })

  // Load the local statuc app
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
