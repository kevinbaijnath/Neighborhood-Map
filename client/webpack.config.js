var path = require('path');

module.exports = {
  entry: './src/map.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {test: /\.(js)$/, exclude: /node_modules/, use: 'babel-loader'}
    ]
  },
  devServer: {
    compress: true,
    port: 9000
  }
};
