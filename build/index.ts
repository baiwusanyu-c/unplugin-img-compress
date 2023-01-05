import * as process from 'process'
import { defineConfig } from 'tsup'
import dts from 'rollup-plugin-dts'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import { rollup } from 'rollup'
let entry = {}
const buildMode = process.env.BUILD_MODE
const baseConfig = {
  entry: {},
  external: ['ora', 'chalk', 'fs-extra'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: true,
  dts: false,
  outDir: '../dist',

}
const configOptions = []
export const build = async(config, buildConfig) => {
  const bundle = await rollup(config)
  return Promise.all(
    buildConfig.map((option) => {
      return bundle.write(option)
    }),
  )
}

// All scripts are packaged to the same file
if (buildMode === 'all') {
  baseConfig.entry = {
    index: '../packages/entry/index.ts',
  }
  configOptions.push(baseConfig)

  const typeConfig = {
    input: '../packages/entry/index.ts', // 必须，入口文件
    plugins: [
      resolve(),
      typescript(),
      dts(),
    ],
  }
  const buildTypeConfig = [
    {
      file: '../dist/index.d.ts',
      format: 'es',
    },
  ]
  build(typeConfig, buildTypeConfig)
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
