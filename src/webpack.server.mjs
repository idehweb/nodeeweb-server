import path from 'path';
import nodeExternals from 'webpack-node-externals';

// const __dirname = path.resolve();

export default {


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
        {
          test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                presets: ['es2015', 'react']
            }
        }
    ]
  }
};