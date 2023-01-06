import * as process from 'process'
import * as path from 'path'
import { defineConfig } from 'tsup'
let entry = {} as Record<string, string>
const buildMode = process.env.BUILD_MODE
const baseConfig = {
  entry: {},
  external: ['ora', 'chalk', 'fs-extra'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: false,
  dts: false,
  outDir: path.resolve(process.cwd(), '../dist'),
}
const configOptions = []

if (buildMode === 'prod') {
  entry = {
    index: '../packages/entry/index.ts',
    core: '../packages/core/index.ts',
    utils: '../utils/index.ts',
  }
  for (const entryKey in entry) {
    const config = JSON.parse(JSON.stringify(baseConfig))
    config.entry = [entry[entryKey]]
    config.outDir = entryKey === 'index'
      ? path.resolve(process.cwd(), '../dist') : path.resolve(process.cwd(), `../dist/${entryKey}`)
    config.dts = true
    configOptions.push(config)
  }
}

if (buildMode === 'dev') {
  entry = {
    index: '../packages/entry/index.ts',
  }
  for (const entryKey in entry) {
    const config = JSON.parse(JSON.stringify(baseConfig))
    config.entry = [entry[entryKey]]
    config.outDir = entryKey === 'index'
      ? path.resolve(process.cwd(), '../dist') : path.resolve(process.cwd(), `../dist/${entryKey}`)
    config.dts = true
    config.watch = true
    config.noExternal = [/@unplugin-img-compress/]
    configOptions.push(config)
  }
}
export default defineConfig(configOptions)
