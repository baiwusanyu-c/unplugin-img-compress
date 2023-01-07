import * as path from 'path'
import { isSupportImg, log } from '@unplugin-img-compress/utils'
import fs, { pathExists, remove } from 'fs-extra'
import { initOption } from './option'
import type { AssetInfo, CompressOption, IBundle } from './types'

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

  const rootFile = path.resolve('img_tinify_record.js')
  const targetDir = optionInner.dir
  // 判断是否存在 cache
  const isExistRecord = await pathExists(rootFile)
  // 根据 cache 对比当前目录
  if (isExistRecord) {

  } else {
    // 不存在则直接开始读取目标文件夹下图片压缩，并记录
    const fileList: Record<string, string> = {}
    // 读取文件
    await getImgFilePath(targetDir, fileList)
    const bundle = await getImgFileBundle(fileList)
    optionInner.compressImgBundle && await optionInner.compressImgBundle(
      '',
      optionInner.APIKey,
      bundle,
    )
  }
  // mode = watch 开启监听
  if (optionInner.mode === 'watch') {

  }
  // 更新缓存文件

  // once 模式，生成 cache 文件，
  // 再次运行-》对比cache-》增加 -》 对目标文件压缩-》 更新 cache 文件
  // 再次运行-》对比cache-》删除 -》  更新 cache 文件

  // watch 模式，生成 cache 文件，监听目标目录文件变化
  // 监听到文件变化-》对比cache-》增加 -》 对目标文件压缩-》 更新 cache 文件
  // 监听到文件变化-》对比cache-》删除 -》  更新 cache 文件
}
