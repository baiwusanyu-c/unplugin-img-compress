import { outputFile } from 'fs-extra'
import { extend, formatSizeUnits, log } from '@unplugin-img-compress/utils'
import tinify from 'tinify'
import { createUnplugin } from 'unplugin'
import { defaultOption } from './default-option'
import type { PluginOption } from 'vite'
import type { CompressOption, IBundle } from './types'
import type { OutputOptions } from 'rollup'

const tinifyBuffer = (data: Uint8Array) => {
  return new Promise((resolve) => {
    tinify.fromBuffer(data)
      .toBuffer((err, resultData) => {
        if (err)
          throw err

        resolve(resultData)
      })
  })
}
const compressImgBundle = async(
  outputDir: string,
  bundle: IBundle,
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
      const tinifyBufferRes = (await tinifyBuffer(bufferSource)) as Uint8Array
      log('success',
        `compression complete:[${fileName}][${formatSizeUnits(tinifyBufferRes.byteLength)}]`,
      )
      // 写入
      await outputFile(`${outputDir}/${fileName}`, tinifyBufferRes, {}, (err: Error) => {
        if (err) throw err
      })
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
  tinify.key = option.APIKey
  return {
    name: 'unplugin-img-compress',
    async writeBundle(
      options: OutputOptions,
      bundle: IBundle) {
      log('info',
        'unplugin-img-compress running...',
      )
      const outputDir = options.dir!.replaceAll('\\', '/')
      if (option.runtime === 'build')
        await compressImgBundle(outputDir, bundle)
    },
  }
})

export const viteImgCompress: (option: CompressOption) => PluginOption = unplugin.vite
export const rollupImgCompress = unplugin.rollup
export const webpackImgCompress = unplugin.webpack
export const esbuildImgCompress = unplugin.esbuild
