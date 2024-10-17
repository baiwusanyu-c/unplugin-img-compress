import { log, setGlobalPrefix } from 'baiwusanyu-utils'
import { createUnplugin } from 'unplugin'
import { initOption } from '../../utils/option'
import type { CompressOption, IBundle, writeBundle } from '../../utils/types'
import type { UnpluginOptions } from 'unplugin'
import type { PluginOption } from 'vite'
import type { OutputOptions } from 'rollup'

const unplugin = createUnplugin(
  (option: CompressOption, meta) => {
    setGlobalPrefix('[unplugin-img-compress]:')
    const optionInner = initOption(option)
    if (!optionInner) {
      return {
        name: 'unplugin-img-compress',
      }
    }
    const ctxWebpack: { dir: string, bundle: IBundle } = { dir: '', bundle: {} }
    return {
      name: 'unplugin-img-compress',
      writeBundle: async(
        outputOptions: OutputOptions,
        bundle: IBundle,
      ) => {
        log('info', '✨ running...')
        log('info', '✨ 【runtime dev】')
        if (optionInner.runtime === 'build' && optionInner.compressImgBundle) {
          if (meta.framework !== 'webpack') {
            const outputDir = outputOptions.dir!.replaceAll('\\', '/')
            optionInner.compressImgBundle(outputDir, optionInner.APIKey, bundle)
          } else {
            optionInner.compressImgBundle(ctxWebpack.dir, optionInner.APIKey, ctxWebpack.bundle)
          }
        }
      },
      webpack(compiler) {
        if (optionInner.runtime === 'build' && optionInner.compressImgBundle && meta.framework === 'webpack') {
          compiler.hooks.emit.tapAsync('ImageAssetsPlugin', (compilation, callback) => {
            ctxWebpack.dir = (compilation.outputOptions.path || './dist').replaceAll('\\', '/')
            for (const filename in compilation.assets) {
              if (/\.(png|jpg|jpeg|gif|svg)$/.test(filename)) {
                const bundleOrg = compilation.assets[filename]
                ctxWebpack.bundle[filename] = {
                  source: bundleOrg.buffer(),
                  fileName: filename,
                  type: 'asset',
                  isAsset: true,
                  name: undefined,
                }
              }
            }
            callback()
          })
        }
      },
    } as UnpluginOptions & { writeBundle?: writeBundle }
  })

export const viteImgCompress: (option: CompressOption) => PluginOption = unplugin.vite
export const rollupImgCompress = unplugin.rollup
export const webpackImgCompress = unplugin.webpack
export const esbuildImgCompress = unplugin.esbuild
