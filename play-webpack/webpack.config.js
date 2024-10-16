const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // 解析的文件后缀
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // HTML 模板文件
    }),
  ],
  devServer: {
    static: './dist', // 开发服务器将文件从 'dist' 目录提供
    port: 3000, // 开发服务器运行在 3000 端口
  },
}
