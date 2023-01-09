#!/usr/bin/env node
import { clearRecord, devCompressImg } from '@unplugin-img-compress/core'
import { loadConfig } from 'unconfig'
import type { CompressOption } from '@unplugin-img-compress/core/types'

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
