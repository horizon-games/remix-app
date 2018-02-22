// remix-dl script downloads remix distribution to be packaged in
// the electron app.
const os = require('os')
const request = require('request')
const fs = require('fs')
const path = require('path')
const unzipper = require('unzipper')
const rimraf = require('rimraf')

const fetchLatestRemixDownloadURL = (cb) => {
  const repoListURL = 'https://api.github.com/repos/ethereum/browser-solidity/contents/?ref=gh-pages'
  const githubReq = {
    url: repoListURL,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.88 Safari/537.36'
    }
  }

  request.get(githubReq, (err, resp, body) => {
    if (err) {
      console.log('github error:', err)
      process.exit(1)
    }

    if (resp.statusCode !== 200) {
      console.log('github: failed to fetch remix download url, got status', resp.statusCode)
      process.exit(1)
    }

    const repo = JSON.parse(body)
    let downloadURL
    
    repo.forEach((obj) => {
      if (obj.name.match(/remix-[a-z0-9]+\.zip/i)) {
        downloadURL = obj.download_url
      }
    })
    
    if (downloadURL) {
      cb(downloadURL)
    } else {
      console.log('github: failed to get latest remix download url')
      process.exit(1)
    }
  })
}

const fetchRemixApp = (url, destPath) => {
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

  const file = fs.createWriteStream(destPath)
  const sendReq = request.get(url)

  sendReq.on('response', (response) => {
    if (response.statusCode !== 200) {
      return err('Unable to download remix file, status: ' + response.statusCode)
    }
  })

  sendReq.on('error', (err) => {
    fs.unlink(destPath)
    return err(err.message)
  })

  sendReq.pipe(file)

  file.on('finish', () => {
    file.close(ret)
  })

  file.on('error', (err) => {
    fs.unlink(destPath)
    return err(err.message)
  })
}



fetchLatestRemixDownloadURL((downloadURL) => {
  console.log(`latest remix download url at ${downloadURL}, downloading & unpacking..`)

  const destPath = path.join(os.tmpdir(), 'remix.zip')
  if (fs.existsSync(destPath)) {
    fs.unlinkSync(destPath)
  }
  fetchRemixApp(downloadURL, destPath)
})
