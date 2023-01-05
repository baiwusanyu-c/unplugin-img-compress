import * as process from 'process'
import { extend, log } from '@unplugin-img-compress/utils'
import { createUnplugin } from 'unplugin'
import { defaultOption } from './default-option'
import type { CompressOption } from './types'
const PLUGIN_NAME = 'unplugin-img-compress'
export const runtime = () => {
  log('info', `test running....${process.env.RUNTIME_ENV}`)
}

export const runtimeBrowser = () => {
  log('info', 'test running....')
}

export const imgCompress = (option: CompressOption) => {
  option = extend(defaultOption, option)

  if (!option.APIKey) {
    log('error', 'Please configure APIKey for tinypng compression....\nSee: https://tinypng.com/')
    return {
      name: PLUGIN_NAME,
    }
  }

  return createUnplugin(() => {
    return {
      name: PLUGIN_NAME,
    }
  })[option.type]
}
