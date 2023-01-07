import type { OutputOptions } from 'rollup'

export declare type compressImgBundle = (
  outputOptions: string,
  APIKey: string,
  bundle: IBundle) => Promise<void>
export declare type writeBundle = (outputOptions: OutputOptions, bundle: IBundle) => Promise<void>

export interface CompressOption{
  //  tinypng 的 APIkey
  APIKey: string
  // 运行时机，是在开发时压缩，还是打包时压缩
  dir: string
  // 运行时机，是在开发时压缩，还是打包时压缩
  runtime: 'build' | 'dev'
  // 文件监听模式，watch 仅在 runtime 为 dev 时有效
  mode: 'watch' | 'once'
  // 压缩方法
  compressImgBundle?: compressImgBundle
}
export interface AssetInfo {
  source: string | Uint8Array
  fileName: string
  type: 'asset'
  isAsset: true
  name: string | undefined
}

export type IBundle = Record<string, AssetInfo>
