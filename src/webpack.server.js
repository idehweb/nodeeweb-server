const path = require('path');
const nodeExternals = require('webpack-node-externals');

// const __dirname = path.resolve();

module.exports = {


  context: path.resolve(path.resolve(), 'src'),
  entry: ['./index.js'],
  output: {
    path: path.join(path.resolve(), 'dist'),
    filename: 'bundle.js'
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: 'url-loader?limit=8192'
      },
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};