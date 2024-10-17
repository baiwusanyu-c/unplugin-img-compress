#!/usr/bin/env node
import { loadConfig } from 'unconfig'
import { clearRecord, devCompressImg } from '../src/index'
import type { CompressOption } from '../utils/types'

const init = async() => {
  const clearIndex = process.argv.findIndex(arg =>
    /^(?:-c|--clear)$/.test(arg),
  )
  if (clearIndex > 0)
    await clearRecord()

  const { config } = await loadConfig<CompressOption>({
    sources: [
      {
        files: 'unplugin-img-compress.config',
        extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json', ''],
      },
    ],
  })
  await devCompressImg(config)
}
init()
