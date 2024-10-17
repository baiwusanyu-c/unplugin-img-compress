import { extend, log } from 'baiwusanyu-utils'
import { compressImgBundle } from '../src/tinify'
import { defaultOption } from './index'
import type { CompressOption } from './types'
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
