import { cwd } from 'node:process'
import path from 'path'
import { describe, expect, it, vi } from 'vitest'
import { jsonClone } from 'baiwusanyu-utils'
import fs, { outputFile, pathExists, readFile, remove } from 'fs-extra'
import { clearRecord, devCompressImg } from '../../index'
import { getImgFileBundle, patchFiles, updateRecord } from '../../runtime-mode-dev'
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

    // mock add
    const testImgDir = `${cwd()}/packages/core/__test__/mode-dev/test.png`
    const bufferRes = await readFile(testImgDir)
    await outputFile(`${opt.dir}/test-res.png`, bufferRes)

    await devCompressImg(opt)
    isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()
    const recordJson = await fs.readJson(recordPath)
    expect(recordJson[`${opt.dir}test-res.png`]).toBe('test-res.png')
  })

  it('cache by once & delete', async() => {
    let isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()

    const opt = jsonClone(option)
    opt.dir = `${cwd()}/packages/core/__test__/mode-dev/`.replaceAll('\\', '/')
    opt.compressImgBundle = async() => {}

    // mock delete
    const testImgDir = `${cwd()}/packages/core/__test__/mode-dev/test-res.png`
    await remove(testImgDir)

    await devCompressImg(opt)
    isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()
    const recordJson = await fs.readJson(recordPath)
    expect(recordJson[`${opt.dir}test-res.png`]).toBe(undefined)
  })

  it('cache by watch & add', async() => {
    let isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()

    const opt = jsonClone(option)
    opt.dir = `${cwd()}/packages/core/__test__/mode-dev/`.replaceAll('\\', '/')
    opt.compressImgBundle = async() => {}
    opt.mode = 'watch'

    // mock add
    const testImgDir = `${cwd()}/packages/core/__test__/mode-dev/test.png`
    const bufferRes = await readFile(testImgDir)
    await outputFile(`${opt.dir}/test-res.png`, bufferRes)

    await devCompressImg(opt)
    isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()
    const recordJson = await fs.readJson(recordPath)
    expect(recordJson[`${opt.dir}test-res.png`]).toBe('test-res.png')
  })

  it('cache by watch & delete', async() => {
    let isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()

    const opt = jsonClone(option)
    opt.dir = `${cwd()}/packages/core/__test__/mode-dev/`.replaceAll('\\', '/')
    opt.compressImgBundle = async() => {}
    opt.mode = 'watch'

    // mock delete
    const testImgDir = `${cwd()}/packages/core/__test__/mode-dev/test-res.png`
    await remove(testImgDir)

    await devCompressImg(opt)
    isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()
    const recordJson = await fs.readJson(recordPath)
    expect(recordJson[`${opt.dir}test-res.png`]).toBe(undefined)
  })

  it('getImgFileBundle', async() => {
    const key = `${cwd()}/packages/core/__test__/mode-dev/test.png`
    const bundle = await getImgFileBundle({
      [key]: 'test.png',
    })
    expect(bundle[key].fileName).toBe('test.png')
    expect(bundle[key].source).toBeTruthy()
    expect(bundle[key].type).toBe('asset')
    expect(bundle[key].isAsset).toBeTruthy()
  })

  it('updateRecord', async() => {
    const mockRecord = {
      'test/test-delete.png': 'test-delete.png',
    }
    await updateRecord('add', 'test/test.png', mockRecord)

    const isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).toBeTruthy()
    const recordJson = await fs.readJson(recordPath)
    expect(recordJson['test/test.png']).toBe('test.png')

    let recordJsonDel = await fs.readJson(recordPath)
    expect(recordJsonDel['test/test-delete.png']).toBe('test-delete.png')
    await updateRecord('unlink', 'test/test-delete.png', mockRecord)
    recordJsonDel = await fs.readJson(recordPath)
    expect(recordJsonDel['test/test-delete.png']).toBe(undefined)
  })

  it('clearRecord', async() => {
    await clearRecord()
    const isExistRecord = await pathExists(recordPath)
    expect(isExistRecord).not.toBeTruthy()
  })

  it('patchFiles', async() => {
    const key = `${cwd()}/packages/core/__test__/mode-dev/test.png`
    const patchRes = await patchFiles(
      {
        'test/test-delete.png': 'test-delete.png',
      },
      {
        [key]: 'test.png',
      })
    expect(patchRes.fileList[key]).toBe('test.png')
    expect(patchRes.fileList['test/test-delete.png']).not.toBeTruthy()

    expect(patchRes.bundle[key].fileName).toBe('test.png')
    expect(patchRes.bundle[key].source).toBeTruthy()
    expect(patchRes.bundle[key].type).toBe('asset')
    expect(patchRes.bundle[key].isAsset).toBeTruthy()
  })
})
