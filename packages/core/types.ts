export interface CompressOption{
  // 指定 unplugin 的平台
  type: 'vite' | 'webpack' | 'rollup'
  //  tinypng 的 APIkey
  APIKey: string
  // 运行时机，是在开发时压缩，还是打包时压缩
  dir: string
  // 运行时机，是在开发时压缩，还是打包时压缩
  runtime: 'build' | 'dev'
  // 文件监听模式，watch 仅在 runtime 为 dev 时有效
  mode: 'watch' | 'once'
}
