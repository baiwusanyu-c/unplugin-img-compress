const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { webpackImgCompress: WebpackImgCompress } = require('../../packages/unplugin-img-compress/dist/index.cjs')
module.exports = {
  entry: './src/index.jsx', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出的文件名
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // 匹配 JS 和 JSX 文件
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf|webm)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              mimetype: 'image/jpg|image/png|image/ico',
              fallback: 'file-loader',
            },
          },
        ],
      },
    ],

  },
  resolve: {
    extensions: ['.js', '.jsx'], // 解析的文件后缀
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML 模板文件
    }),
    WebpackImgCompress({
      APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
      dir: '', // runtime = build 时无用，图片直接从钩子里取, 这里直接传空
      runtime: 'build',
      mode: 'once',
    }),
  ],
  devServer: {
    static: './dist', // 开发服务器将文件从 'dist' 目录提供
    port: 3000, // 开发服务器运行在 3000 端口
  },
}
