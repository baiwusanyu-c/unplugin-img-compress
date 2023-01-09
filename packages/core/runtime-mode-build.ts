import { log } from '@unplugin-img-compress/utils'
import { createUnplugin } from 'unplugin'
import { initOption } from './option'
import type { CompressOption, IBundle, writeBundle } from './types'
import type { UnpluginOptions } from 'unplugin'
import type { PluginOption } from 'vite'
import type { OutputOptions } from 'rollup'

const unplugin = createUnplugin(
  (option: CompressOption): UnpluginOptions & { writeBundle?: writeBundle } => {
    const optionInner = initOption(option)
    if (!optionInner) {
      return {
        name: 'unplugin-img-compress',
      }
    }
    return {
      name: 'unplugin-img-compress',
      async writeBundle(
        outputOptions: OutputOptions,
        bundle: IBundle) {
        log('info', '✨ : unplugin-img-compress running...[runtime dev]')
        if (optionInner.runtime === 'build' && optionInner.compressImgBundle) {
          const outputDir = outputOptions.dir!.replaceAll('\\', '/')
          await optionInner.compressImgBundle(outputDir, optionInner.APIKey, bundle)
        }
      },
    }
  })

export const viteImgCompress: (option: CompressOption) => PluginOption = unplugin.vite
export const rollupImgCompress = unplugin.rollup
export const webpackImgCompress = unplugin.webpack
export const esbuildImgCompress = unplugin.esbuild
