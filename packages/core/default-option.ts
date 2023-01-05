import { resolve } from 'path'
import type { CompressOption } from './types'
export const defaultOption: CompressOption = {
  APIKey: '',
  dir: `${resolve()}asset`,
  runtime: 'build',
  mode: 'once',
}
