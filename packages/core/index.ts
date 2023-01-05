import { outputFile } from 'fs-extra'
import { extend, formatSizeUnits, log } from '@unplugin-img-compress/utils'
import tinify from 'tinify'
import { createUnplugin } from 'unplugin'
import { defaultOption } from './default-option'
import type { PluginOption } from 'vite'
import type { CompressOption, IBundle } from './types'
import type { OutputOptions } from 'rollup'

export const tinifyBuffer = (data: Uint8Array, APIKey: string) => {
  tinify.key = APIKey
  return new Promise((resolve) => {
    tinify.fromBuffer(data)
      .toBuffer((err, resultData) => {
        if (err)
          throw err

        resolve(resultData)
      })
  })
}
export const compressImgBundle = async(
  outputDir: string,
  APIKey: string,
  bundle: IBundle,
  tinify = tinifyBuffer,
) => {
  for (const key in bundle) {
    // 匹配是否为图片
    if (/\.(png|jpg|gif|jpeg|svg)$/i.test(key)) {
      const fileName = bundle[key].fileName
      const bufferSource = bundle[key].source as Uint8Array
      // 压缩
      log('info',
            `compression start:[${fileName}][${formatSizeUnits(bufferSource.byteLength)}]`,
      )
      const tinifyBufferRes = (await tinify(bufferSource, APIKey)) as Uint8Array
      log('success',
            `compression complete:[${fileName}][${formatSizeUnits(tinifyBufferRes.byteLength)}]`,
      )
      // 写入
      await outputFile(`${outputDir}/${fileName}`, tinifyBufferRes)
      log('success',
            `write complete:[${fileName}][${formatSizeUnits(tinifyBufferRes.byteLength)}]`,
      )
    }
  }
}
const unplugin = createUnplugin((option: CompressOption) => {
  option = extend(defaultOption, option)
  if (!option.APIKey) {
    log('error', 'Please configure APIKey for tinypng compression....\nSee: https://tinypng.com/')
    return {
      name: 'unplugin-img-compress',
    }
  }
  if (!option.compressImgBundle)
    option.compressImgBundle = compressImgBundle

  return {
    name: 'unplugin-img-compress',
    async writeBundle(
      outputOptions: OutputOptions,
      bundle: IBundle) {
      log('info', 'unplugin-img-compress running...')
      if (option.runtime === 'build' && option.compressImgBundle) {
        const outputDir = outputOptions.dir!.replaceAll('\\', '/')
        await option.compressImgBundle(outputDir, option.APIKey, bundle)
      }
    },
  }
})

export const viteImgCompress: (option: CompressOption) => PluginOption = unplugin.vite
export const rollupImgCompress = unplugin.rollup
export const webpackImgCompress = unplugin.webpack
export const esbuildImgCompress = unplugin.esbuild
