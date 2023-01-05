import { cwd } from 'node:process'
import { describe, expect, it, vi } from 'vitest'
import fs from 'fs-extra'
import { compressImgBundle, viteImgCompress } from '../index'
import { jsonClone } from '../../../utils'
import type { PluginOption } from 'vite'
import type { CompressOption } from '../types'

const option = {
  APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
  dir: './',
  runtime: 'build',
  mode: 'once',
} as CompressOption

describe('test core', () => {
  it('no APIKey', () => {
    const opt = jsonClone(option)
    opt.APIKey = ''
    const plugin = viteImgCompress(opt) as PluginOption
    if (plugin) {
      if ('writeBundle' in plugin)
        expect(plugin.writeBundle).not.toBeTruthy()
    }
  })

  it('not run & runtime is dev', async() => {
    const opt = jsonClone(option)
    opt.runtime = 'dev'
    opt.compressImgBundle = vi.fn()
    const plugin = viteImgCompress(option) as PluginOption
    if (plugin) {
      if ('writeBundle' in plugin)
        expect(opt.compressImgBundle).not.toBeCalled()
    }
  })

  it('compressImgBundle', async() => {
    const bufferRes = await fs.readFile(`${cwd()}/__test__/test.png`)
    const callFn = vi.fn()
    const tinifyFn = async(data: Uint8Array) => {
      callFn()
      return Promise.resolve(data)
    }
    await compressImgBundle(
      `${cwd()}/__test__/`,
      option.APIKey,
      {
        'test.png': {
          fileName: 'test-res.png',
          source: bufferRes,
        },
      } as any,
      tinifyFn,
    )
    expect(callFn).toBeCalled()
    const exists = await fs.pathExists(`${cwd()}/__test__/test-res.png`)
    expect(exists).toBeTruthy()
  })
})
