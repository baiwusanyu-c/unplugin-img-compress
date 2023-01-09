import { cwd } from 'node:process'
import path from 'path'
import { describe, expect, it, vi } from 'vitest'
import { jsonClone } from '@unplugin-img-compress/utils'
import fs, { pathExists } from 'fs-extra'
import { clearRecord, devCompressImg } from '../../index'
import type { CompressOption } from '../../types'
const recordPath = `${path.resolve()}/IMG_TINIFY_RECORD.json`
const option = {
  APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
  dir: './',
  runtime: 'dev',
  mode: 'once',
} as CompressOption

describe('test mode dev', () => {
  it('no APIKey', async() => {
    const opt = jsonClone(option)
    opt.APIKey = ''
    opt.compressImgBundle = vi.fn()
    await devCompressImg(opt)
    expect(opt.compressImgBundle).not.toBeCalled()
  })

  it('not run & runtime is build', async() => {
    const opt = jsonClone(option)
    opt.runtime = 'build'
    opt.compressImgBundle = vi.fn()
    await devCompressImg(opt)
    expect(opt.compressImgBundle).not.toBeCalled()
  })

  it('no cache by once', async() => {
    await clearRecord()
    let isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).not.toBeTruthy()

    const opt = jsonClone(option)
    opt.dir = `${cwd()}/packages/core/__test__/mode-dev/`.replaceAll('\\', '/')
    opt.compressImgBundle = async() => {}

    await devCompressImg(opt)
    isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()
    const recordJson = await fs.readJson(recordPath)
    expect(recordJson[`${opt.dir}test.png`]).toBe('test.png')
  })

  it('cache by once & add', async() => {
    let isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()

    const opt = jsonClone(option)
    opt.dir = `${cwd()}/packages/core/__test__/mode-dev/`.replaceAll('\\', '/')
    opt.compressImgBundle = async() => {}
  })

  it('cache by once & delete', async() => {

  })

  it('cache by watch & add', async() => {

  })

  it('cache by watch & delete', async() => {

  })

  // TODO function unit test
})
