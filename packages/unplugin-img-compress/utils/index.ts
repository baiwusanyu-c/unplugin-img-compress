import { resolve } from 'path'
import type { CompressOption } from './types'

export const isSupportImg = (key: string) => /\.(png|jpg|jpeg|webp)$/i.test(key)
export const defaultOption: CompressOption = {
  APIKey: '',
  dir: [`${resolve()}asset`],
  runtime: 'build',
  mode: 'once',
}
