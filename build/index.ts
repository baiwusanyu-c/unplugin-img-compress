import * as process from 'process'
import * as path from 'path'
import { defineConfig } from 'tsup'
let entry = {} as Record<string, string>
const buildMode = process.env.BUILD_MODE
const baseConfig = {
  entry: {},
  external: ['ora', 'fs-extra'],
  format: ['cjs', 'esm'],
  clean: true,
  minify: false,
  dts: false,
  outDir: path.resolve(process.cwd(), '../dist'),
}
const configOptions = []

if (buildMode === 'prod') {
  entry = {
    index: '../packages/unplugin-img-compress/src/index.ts',
    bin: '../packages/unplugin-img-compress/bin/index.ts',
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
    index: '../packages/unplugin-img-compress/src/index.ts',
  }
  for (const entryKey in entry) {
    const config = JSON.parse(JSON.stringify(baseConfig))
    config.entry = [entry[entryKey]]
    config.outDir = path.resolve(process.cwd(), '../packages/unplugin-img-compress/dist')
    config.dts = true
    config.watch = true
    configOptions.push(config)
  }
}
export default defineConfig(configOptions)
