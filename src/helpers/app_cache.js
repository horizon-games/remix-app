import { BrowserWindow, webContents } from 'electron'
import fs from 'fs'
import path from 'path'
import jetpack from 'fs-jetpack'
import fetch from 'electron-fetch'

const registerAppCache = (browserWindow, userDataPath) => {

  // Attempt to fetch the list.json to determine if we're online
  // and the contents are available, in this case, we will always
  // fetch the latest list of available compilers, but fallback
  // to a local version if available.
  let getList = false
  const listURL = 'https://solc-bin.ethereum.org/bin/list.json'
  const resp = fetch(listURL)
  resp.then((resp) => {
    if (resp.status === 200) {
      getList = true
    }
  }).catch((err) => {
    getList = false
  })

  const filter = {
    urls: ['https://solc-bin.ethereum.org/bin/*']
  }

  const session = browserWindow.webContents.session

  session.webRequest.onBeforeRequest(filter, (details, callback) => {
    const resourceURL = details.url
    const resourceFilename = getFilename(resourceURL)
    const localFile = cachedFilePath(userDataPath, resourceURL)

    // Always fetch the new list.json if we're online
    if (getList && resourceFilename === 'list.json') {
      callback({ cancel: false })
      return
    }

    // Serve locally cached files if they are available
    if (fs.existsSync(localFile)) {
      callback({
        cancel: false,
        redirectURL: `file://${localFile}`
      })
    } else {
      callback({ cancel: false })
    }
  })

  session.webRequest.onCompleted(filter, (details) => {
    const resourceURL = details.url

    const resp = fetch(resourceURL)

    resp.then((resp) => {
      if (resp.status === 200) {
        const filename = getFilename(resourceURL)
        const dest = fs.createWriteStream(cachedFilePath(userDataPath, resourceURL))
        resp.body.pipe(dest)
      }
    }).catch((err) => {})
  })

}

const getFilename = (url) => {
  return url.split('/').pop()
}

const cachedFilePath = (userDataPath, url) => {
  return path.join(userDataPath, getFilename(url))
}

export { registerAppCache }
