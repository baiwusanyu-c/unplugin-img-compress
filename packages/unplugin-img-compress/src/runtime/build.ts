import { log, setGlobalPrefix } from 'baiwusanyu-utils'
import { createUnplugin } from 'unplugin'
import { initOption } from '../../utils/option'
import type { CompressOption, IBundle, writeBundle } from '../../utils/types'
import type { RspackCompiler, UnpluginOptions } from 'unplugin'
import type { PluginOption } from 'vite'
import type { OutputOptions } from 'rollup'
import type { Compilation as RspackCompilation } from '@rspack/core'
import type { Compilation as WebpackCompilation, Compiler as WebpackCompiler } from 'webpack'
function webRspackHandler(
  ctx: { dir: string, bundle: IBundle },
  compiler: RspackCompiler | WebpackCompiler,
) {
  compiler.hooks.emit.tapAsync('unplugin-img-compress', (
    compilation: RspackCompilation | WebpackCompilation,
    callback: any) => {
    ctx.dir = (compilation.outputOptions.path || './dist').replaceAll('\\', '/')
    for (const filename in compilation.assets) {
      if (/\.(png|jpg|jpeg|gif|svg)$/.test(filename)) {
        const bundleOrg = compilation.assets[filename]
        ctx.bundle[filename] = {
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

const unplugin = createUnplugin(
  (option: CompressOption, meta) => {
    setGlobalPrefix('[unplugin-img-compress]:')
    const optionInner = initOption(option)
    if (!optionInner) {
      return {
        name: 'unplugin-img-compress',
      }
    }
    const ctxWebRspack: { dir: string, bundle: IBundle } = { dir: '', bundle: {} }
    return {
      name: 'unplugin-img-compress',
      writeBundle: async(
        outputOptions: OutputOptions,
        bundle: IBundle,
      ) => {
        log('info', '✨ running...')
        log('info', '✨ 【runtime dev】')
        if (optionInner.runtime === 'build' && optionInner.compressImgBundle) {
          if (meta.framework !== 'webpack' && meta.framework !== 'rspack') {
            const outputDir = outputOptions.dir!.replaceAll('\\', '/')
            optionInner.compressImgBundle(outputDir, optionInner.APIKey, bundle)
          } else if (meta.framework === 'webpack' || meta.framework === 'rspack') {
            optionInner.compressImgBundle(ctxWebRspack.dir, optionInner.APIKey, ctxWebRspack.bundle)
          }
        }
      },
      rspack(compiler: RspackCompiler) {
        if (optionInner.runtime === 'build' && optionInner.compressImgBundle && meta.framework === 'rspack')
          webRspackHandler(ctxWebRspack, compiler)
      },
      webpack(compiler) {
        if (optionInner.runtime === 'build' && optionInner.compressImgBundle && meta.framework === 'webpack')
          webRspackHandler(ctxWebRspack, compiler)
      },
    } as UnpluginOptions & { writeBundle?: writeBundle }
  })

export const viteImgCompress: (option: CompressOption) => PluginOption = unplugin.vite
export const rollupImgCompress = unplugin.rollup
export const webpackImgCompress = unplugin.webpack
export const esbuildImgCompress = unplugin.esbuild
export const rspackImgCompress = unplugin.rspack
