const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = env => {
  return {
    target: 'node',
    node: {
      __dirname: false,
      __filename: false
    },
    entry: {
      main: './src/main.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, './build')
    },
    externals: [ nodeExternals() ],
    resolve: {
      alias: {
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader']
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'NODE_ENV': JSON.stringify(env)
      })
    ]
  }
}
