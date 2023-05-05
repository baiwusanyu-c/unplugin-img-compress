import { log, setGlobalPrefix } from 'baiwusanyu-utils'
import { createUnplugin } from 'unplugin'
import { initOption } from './option'
import type { CompressOption, IBundle, writeBundle } from './types'
import type { UnpluginOptions } from 'unplugin'
import type { PluginOption } from 'vite'
import type { OutputOptions } from 'rollup'

const unplugin = createUnplugin(
  (option: CompressOption) => {
    setGlobalPrefix('[unplugin-img-compress]:')
    const optionInner = initOption(option)
    if (!optionInner) {
      return {
        name: 'unplugin-img-compress',
      }
    }
    return {
      name: 'unplugin-img-compress',
      writeBundle: async(
        outputOptions: OutputOptions,
        bundle: IBundle,
      ) => {
        log('info', '✨ running...')
        log('info', '✨ 【runtime dev】')
        if (optionInner.runtime === 'build' && optionInner.compressImgBundle) {
          const outputDir = outputOptions.dir!.replaceAll('\\', '/')
          optionInner.compressImgBundle(outputDir, optionInner.APIKey, bundle)
        }
      },
    } as UnpluginOptions & { writeBundle?: writeBundle }
  })

export const viteImgCompress: (option: CompressOption) => PluginOption = unplugin.vite
export const rollupImgCompress = unplugin.rollup
export const webpackImgCompress = unplugin.webpack
export const esbuildImgCompress = unplugin.esbuild
