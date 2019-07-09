const { spawnSync } = require('child_process')
const childProcess = require('child_process')
const webpack = require('webpack')
const config = require('../webpack.config')
const electron = require('electron')

const env = 'development'
const compiler = webpack(config(env))

let electronStarted = false

const watching = compiler.watch({}, (err, stats) => {
  if (!err && !stats.hasErrors() && !electronStarted) {
    electronStarted = true

    childProcess
      .spawn(electron, ['.'], { stdio: 'inherit' })
      .on('close', () => {
        watching.close()
      })
  }
})
