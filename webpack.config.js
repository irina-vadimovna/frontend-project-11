// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';

const isProduction = process.env.NODE_ENV === 'production';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(dirname, 'dist'),
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  performance: { hints: false },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: 'babel-loader',
      },
      {
        test: /\.(sass|less|css)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};

export default () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
