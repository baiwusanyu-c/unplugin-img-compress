export interface CompressOption{
  //  tinypng 的 APIkey
  APIKey: string
  // 运行时机，是在开发时压缩，还是打包时压缩
  dir: string
  // 运行时机，是在开发时压缩，还是打包时压缩
  runtime: 'build' | 'dev'
  // 文件监听模式，watch 仅在 runtime 为 dev 时有效
  mode: 'watch' | 'once'
}
export interface AssetInfo {
  name: string | undefined
  source: string | Uint8Array
  type: 'asset'
  fileName: string
  isAsset: true
}

export type IBundle = Record<string, AssetInfo>
