import * as process from 'process'
import { defineConfig } from 'tsup'
import { rollup } from 'rollup'
import type { OutputOptions } from 'rollup'
let entry = {} as Record<string, string>
const buildMode = process.env.BUILD_MODE
const baseConfig = {
  entry: {},
  external: ['ora', 'chalk', 'fs-extra'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: false,
  dts: false,
  outDir: '../dist',

}
const configOptions = []
export const build = async(
  config: OutputOptions,
  buildConfig: Array<OutputOptions>) => {
  const bundle = await rollup(config)
  return Promise.all(
    buildConfig.map((option: OutputOptions) => {
      return bundle.write(option)
    }),
  )
}

// You can output packaged products according to your desired folder structure
if (buildMode === 'split') {
  entry = {
    index: '../packages/entry/index.ts',
    core: '../packages/core/index.ts',
    utils: '../utils/index.ts',
  }
  for (const entryKey in entry) {
    const config = JSON.parse(JSON.stringify(baseConfig))
    config.entry = [entry[entryKey]]
    config.outDir = entryKey === 'index' ? './dist' : `./dist/${entryKey}`
    config.dts = true
    configOptions.push(config)
  }
}

export default defineConfig(configOptions)
