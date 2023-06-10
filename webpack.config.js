// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    login: './src/index.js',
    home: './src/home.js',
    article_parts_selection: './src/article_parts_selection.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  mode: 'development',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 8080,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['login'],
    }),
    new HtmlWebpackPlugin({
      template: './public/home.html',
      filename: 'home.html',
      chunks: ['home'],
    }),
    new HtmlWebpackPlugin({
      template: './public/article_parts_selection.html',
      filename: 'article_parts_selection.html',
      chunks: ['article_parts_selection'],
    }),
  ],
  
};