import { resolve } from 'path'
import { extend, log } from 'baiwusanyu-utils'
import { compressImgBundle } from './compress-tinify'
import type { CompressOption } from './types'
export const defaultOption: CompressOption = {
  APIKey: '',
  dir: [`${resolve()}asset`],
  runtime: 'build',
  mode: 'once',
}

export function initOption(option: CompressOption) {
  option = extend(defaultOption, option)
  if (typeof option.dir === 'string')
    option.dir = [option.dir]

  if (!option.APIKey) {
    log('error', 'Please configure APIKey for tinypng compression....\nSee: https://tinypng.com/')
    return false
  }
  if (!option.compressImgBundle)
    option.compressImgBundle = compressImgBundle

  return option
}
