import tinify from 'tinify'
import { outputFile } from 'fs-extra'
import chalk from 'chalk'
import { formatSizeUnits, isSupportImg } from '@unplugin-img-compress/utils'
import type { IBundle } from './types'

export const tinifyBuffer = (data: Uint8Array, APIKey: string) => {
  tinify.key = APIKey
  return new Promise((resolve) => {
    tinify.fromBuffer(data)
      .toBuffer((err, resultData) => {
        if (err)
          throw err

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
        console.log(
          chalk.greenBright.bold('✨ : start compression'),
          chalk.blueBright.bold(`[${fileName}]`))
        // 压缩
        const tinifyBufferRes = (await tinify(bufferSource, APIKey)) as Uint8Array
        // 写入
        await outputFile(outputDir ? `${outputDir}/${fileName}` : key, tinifyBufferRes)
        console.log(
          '✅ : ',
          chalk.blueBright.bold(`[${fileName}]`),
          chalk.yellowBright.bold(`[${formatSizeUnits(bufferSource.byteLength)}]`),
          '->',
          chalk.greenBright.bold(`[${formatSizeUnits(tinifyBufferRes.byteLength)}]`))
      }
      const task = new Promise((resolve) => {
        resolve(goCompress())
      })
      taskList.push(task)
    }
  }
  await Promise.all(taskList)
}
