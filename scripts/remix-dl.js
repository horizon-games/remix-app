// remix-dl script downloads remix distribution to be packaged in
// the electron app.
const os = require('os')
const request = require('request')
const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const rimraf = require('rimraf')
const pkgJson = require('../package.json')

const destPath = path.join(os.tmpdir(), 'remix.zip')

const download = (url, dest, ret, err) => {
  var file = fs.createWriteStream(dest)
  var sendReq = request.get(url)

  sendReq.on('response', function(response) {
      if (response.statusCode !== 200) {
        return err('Unable to download remix file, status: ' + response.statusCode)
      }
  });

  sendReq.on('error', function (err) {
      fs.unlink(dest)
      return err(err.message)
  })

  sendReq.pipe(file)

  file.on('finish', function() {
      file.close(ret)
  })

  file.on('error', function(err) {
      fs.unlink(dest)
      return err(err.message)
  })
}

const ret = () => {
  const appDir = path.join(path.dirname(fs.realpathSync(__filename)), '../build/app')

  rimraf(appDir, () => {
    const reader = fs.createReadStream(destPath)
    reader.pipe(unzipper.Extract({ path: appDir }))
    fs.unlinkSync(destPath)
  }) 
}

const err = (msg) => {
  console.error(msg)
}

download(pkgJson.remixFile, destPath, ret, err)
