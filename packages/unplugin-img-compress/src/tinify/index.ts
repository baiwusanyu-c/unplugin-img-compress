import tinify from 'tinify'
import { outputFile } from 'fs-extra'
import { log, normalizeSizeUnits } from 'baiwusanyu-utils'
import { isSupportImg } from '../../utils'
import type { IBundle } from '../../utils/types'

export const tinifyBuffer = (data: Uint8Array, APIKey: string) => {
  tinify.key = APIKey
  return new Promise((resolve) => {
    tinify.fromBuffer(data)
      .toBuffer((err, resultData) => {
        if (err) {
          log('error', err.message)
          resolve(data)
        }
        resolve(resultData)
      })
  })
}
export const compressImgBundle = async(
  outputDir: string,
  APIKey: string,
  bundle: IBundle,
  tinify = tinifyBuffer,
) => {
  const taskList = []
  for (const key in bundle) {
    // 匹配是否为图片
    if (isSupportImg(key)) {
      const goCompress = async() => {
        const fileName = bundle[key].fileName
        const bufferSource = bundle[key].source as Uint8Array
        log('info', `✨  start compression 【${fileName}】`)
        // 压缩
        const tinifyBufferRes = (await tinify(bufferSource, APIKey)) as Uint8Array
        // 写入
        await outputFile(outputDir ? `${outputDir}/${fileName}` : key, tinifyBufferRes)
        log('info', `【${fileName}】`)
        log('warning', `✅  before - ${normalizeSizeUnits(bufferSource.byteLength)}`)
        log('success', `✅  after - ${normalizeSizeUnits(tinifyBufferRes.byteLength)}`)
      }
      const task = new Promise((resolve) => {
        resolve(goCompress())
      })
      taskList.push(task)
    }
  }
  await Promise.all(taskList)
}
