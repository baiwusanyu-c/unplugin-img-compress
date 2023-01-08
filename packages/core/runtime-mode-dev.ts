import * as path from 'path'
import { cwd } from 'node:process'
import { isSupportImg, log } from '@unplugin-img-compress/utils'
import fs, { pathExists } from 'fs-extra'
import chokidar from 'chokidar'
import { initOption } from './option'
import type { AssetInfo, CompressOption, IBundle } from './types'

const IMG_TINIFY_RECORD = 'IMG_TINIFY_RECORD.json'
const getImgFilePath = async(
  filePath: string,
  fileList: Record<string, string> = {}) => {
  const files = await fs.readdir(filePath)
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const fileDir = path.join(filePath, fileName)
    const stats = await fs.stat(fileDir)
    const isFile = stats.isFile()
    // 是否是文件夹
    const isDir = stats.isDirectory()
    if (isFile && isSupportImg(fileName)) {
      // 最后打印的就是完整的文件路径了
      const key = `${fileDir.replaceAll('\\', '/')}`
      fileList[key] = fileName
    }
    // 如果是文件夹
    if (isDir) await getImgFilePath(fileDir, fileList)
  }
}
async function getImgFileBundle(fileList: Record<string, string>) {
  const bundle = {} as IBundle
  for (const key in fileList) {
    const source = await fs.readFile(key)
    bundle[key as string] = {
      fileName: fileList[key],
      source,
      type: 'asset',
      isAsset: true,
      name: undefined,
    } as AssetInfo
  }
  return bundle
}

const createRecord = async(recordContent: Record<string, string>) => {
  await fs.writeJson(`${path.resolve()}/${IMG_TINIFY_RECORD}`, recordContent, { spaces: 2 })
}

const updateRecord = async(
  evt: 'add' | 'unlink',
  targetPath: string,
  recordContent: Record<string, string>) => {
  if (evt === 'unlink') {
    Reflect.deleteProperty(recordContent, targetPath)
  } else {
    const arr = targetPath.split('/')
    recordContent[targetPath] = arr[arr.length - 1]
  }
  await fs.writeJson(`${path.resolve()}/${IMG_TINIFY_RECORD}`, recordContent, { spaces: 2 })
}

const patchFiles = async(fl1: Record<string, string>, fl2: Record<string, string>) => {
  const res = fl1
  const oFlKeys = Object.keys(fl1)
  const nFlkeys = Object.keys(fl2)
  const addFiles: Record<string, string> = {}
  for (let j = 0; j < nFlkeys.length; j++) {
    // 新增
    if (!fl1[nFlkeys[j]]) {
      res[nFlkeys[j]] = fl2[nFlkeys[j]]
      addFiles[nFlkeys[j]] = fl2[nFlkeys[j]]
    }
  }

  for (let j = 0; j < oFlKeys.length; j++) {
    // 删除
    if (!fl2[oFlKeys[j]])
      Reflect.deleteProperty(res, oFlKeys[j])
  }
  return {
    fileList: res,
    bundle: await getImgFileBundle(addFiles),
  }
}

export async function compressImg(option: CompressOption) {
  const optionInner = initOption(option)

  if (!optionInner) {
    log('error', 'Please configure APIKey for tinypng compression....\nSee: https://tinypng.com/')
    return
  }
  if (optionInner.runtime === 'build') {
    log('error', '"option.runtime = build" is not supported by "compressImg"')
    return
  }

  log('info', '✨ : unplugin-img-compress running...[runtime dev]')

  const rootFile = path.resolve(IMG_TINIFY_RECORD)
  const targetDir = optionInner.dir
  let bundle = {}
  let fileList: Record<string, string> = {}
  await getImgFilePath(targetDir, fileList)
  // 判断是否存在 cache
  const isExistRecord = await pathExists(rootFile)
  // 根据 cache 对比当前目录
  if (isExistRecord) {
    const recordJson = await fs.readJson(`${path.resolve()}/${IMG_TINIFY_RECORD}`)
    const patchRes = await patchFiles(recordJson, fileList)
    fileList = patchRes.fileList
    bundle = patchRes.bundle
  } else {
    bundle = await getImgFileBundle(fileList)
  }
  // 存储缓存
  await createRecord(fileList)
  // 压缩
  optionInner.compressImgBundle && await optionInner.compressImgBundle(
    '',
    optionInner.APIKey,
    bundle,
  )

  // mode = watch 开启监听
  let isInit = 0
  if (optionInner.mode === 'watch') {
    chokidar.watch(path.resolve(cwd(), targetDir), {
      atomic: true,
      followSymlinks: true,
    }).on('all', async(event: string, pathDir: string) => {
      if (isSupportImg(pathDir)) {
        if (isInit < Object.keys(fileList).length) {
          isInit++
          return
        }
        const arr = pathDir.split('/')
        switch (event) {
          case 'add':
            await updateRecord(event, pathDir, fileList)
            optionInner.compressImgBundle && await optionInner.compressImgBundle(
              '',
              optionInner.APIKey,
              await getImgFileBundle({ [pathDir]: arr[arr.length - 1] }),
            )
            break
          case 'unlink':
            updateRecord(event, pathDir, fileList)
            break
          case 'change': // TODO
          default:
            break
        }
      }
    })
  }

  // once 模式，生成 cache 文件，
  // 再次运行-》对比cache-》增加 -》 对目标文件压缩-》 更新 cache 文件
  // 再次运行-》对比cache-》删除 -》  更新 cache 文件

  // watch 模式，生成 cache 文件，监听目标目录文件变化
  // 监听到文件变化-》对比cache-》增加 -》 对目标文件压缩-》 更新 cache 文件
  // 监听到文件变化-》对比cache-》删除 -》  更新 cache 文件
}
