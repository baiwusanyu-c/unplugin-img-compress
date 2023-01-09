// import { cwd } from 'node:process'
import { describe, expect, it, vi } from 'vitest'
// import { pathExists, readFile, remove } from 'fs-extra'
import { devCompressImg } from '../index'
// import { compressImgBundle } from '../compress-tinify'
import { jsonClone } from '../../../utils'
import type { PluginOption } from 'vite'
import type { CompressOption } from '../types'

const option = {
  APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
  dir: './',
  runtime: 'dev',
  mode: 'once',
} as CompressOption

describe('test mode dev', () => {
  it('no APIKey', () => {
    const opt = jsonClone(option)
    opt.APIKey = ''
    const plugin = devCompressImg(opt) as PluginOption
    if (plugin) {
      if ('writeBundle' in plugin)
        expect(plugin.writeBundle).not.toBeTruthy()
    }
  })

  it('not run & runtime is build', async() => {
    const opt = jsonClone(option)
    opt.runtime = 'build'
    opt.compressImgBundle = vi.fn()
    const plugin = devCompressImg(option) as PluginOption
    if (plugin) {
      if ('writeBundle' in plugin)
        expect(opt.compressImgBundle).not.toBeCalled()
    }
  })
})
