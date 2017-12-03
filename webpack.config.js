var webpack = require('webpack')

module.exports = {
  entry: {
    html: './index.html',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: "file-loader?name=[name].[ext]"
      }
    ]
  }
}
