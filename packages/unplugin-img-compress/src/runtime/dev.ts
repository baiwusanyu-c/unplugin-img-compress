import * as path from 'path'
import { cwd } from 'node:process'
import { pathExists, readFile, readJson, readdir, remove, stat, writeJson } from 'fs-extra'
import chokidar from 'chokidar'
import { log, setGlobalPrefix } from 'baiwusanyu-utils'
import { isSupportImg } from '../../utils'
import { initOption } from '../../utils/option'
import type { AssetInfo, CompressOption, IBundle } from '../../utils/types'

const IMG_TINIFY_RECORD = 'IMG_TINIFY_RECORD.json'
const getImgFilePath = async(
  filePath: string,
  fileList: Record<string, string> = {}) => {
  const files = await readdir(filePath)
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i]
    const fileDir = path.join(filePath, fileName)
    const stats = await stat(fileDir)
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

export async function getImgFileBundle(fileList: Record<string, string>) {
  const bundle = {} as IBundle
  for (const key in fileList) {
    const source = await readFile(key)
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
  await writeJson(`${path.resolve()}/${IMG_TINIFY_RECORD}`, recordContent, { spaces: 2 })
}

export const updateRecord = async(
  evt: 'add' | 'unlink',
  targetPath: string,
  recordContent: Record<string, string>) => {
  if (evt === 'unlink') {
    Reflect.deleteProperty(recordContent, targetPath)
  } else {
    const arr = targetPath.split('/')
    recordContent[targetPath] = arr[arr.length - 1]
  }
  await writeJson(`${path.resolve()}/${IMG_TINIFY_RECORD}`, recordContent, { spaces: 2 })
}

export const clearRecord = async() => {
  await remove(`${path.resolve()}/${IMG_TINIFY_RECORD}`)
  log('success', `delete ${IMG_TINIFY_RECORD}.json success !`)
}

export const patchFiles = async(fl1: Record<string, string>, fl2: Record<string, string>) => {
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
  setGlobalPrefix('[unplugin-img-compress]:')
  const optionInner = initOption(option)

  if (!optionInner) {
    log('error', 'Please configure APIKey for tinypng compression....\nSee: https://tinypng.com/')
    return
  }
  if (optionInner.runtime === 'build') {
    log('error', '"option.runtime = build" is not supported by "compressImg"')
    return
  }

  log('info', '✨ running...')
  log('info', '✨ 【runtime dev】')
  const rootFile = path.resolve(IMG_TINIFY_RECORD)
  const targetDir = optionInner.dir
  let bundle = {} as IBundle
  let fileList: Record<string, string> = {}
  for (let i = 0; i < targetDir.length; i++)
    await getImgFilePath(targetDir[i], fileList)

  // 判断是否存在 cache
  const isExistRecord = await pathExists(rootFile)
  // 根据 cache 对比当前目录
  if (isExistRecord) {
    const recordJson = await readJson(`${path.resolve()}/${IMG_TINIFY_RECORD}`)
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
    const targetArr = (targetDir as Array<string>).map(val => path.resolve(cwd(), val))
    chokidar.watch(targetArr, {
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
            pathDir = pathDir.replaceAll('\\', '/')
            await updateRecord(event, pathDir, fileList)
            optionInner.compressImgBundle && await optionInner.compressImgBundle(
              '',
              optionInner.APIKey,
              await getImgFileBundle({ [pathDir]: arr[arr.length - 1] }),
            )
            break
          case 'unlink':
            pathDir = pathDir.replaceAll('\\', '/')
            updateRecord(event, pathDir, fileList)
            break
          case 'change':
            break
          default:
            break
        }
      }
    })
  }
}
