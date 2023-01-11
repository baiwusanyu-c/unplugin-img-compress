import chalk from 'chalk'
import type { TLog } from './types'

export const log = (type: TLog, msg: string) => {
  if (type === 'info')
    console.log(chalk.blueBright.bold(`${msg}`))

  if (type === 'error')
    console.log(chalk.redBright.bold(`${msg}`))

  if (type === 'warning')
    console.log(chalk.yellowBright.bold(`${msg}`))

  if (type === 'success')
    console.log(chalk.greenBright.bold(`${msg}`))
}

export const extend = <
    T extends Record<string, any>,
    U extends Record<string, any>>(
    objFir: T,
    objSec: U): T & U => {
  return Object.assign({}, objFir, objSec)
}

export function formatSizeUnits(bytes: number): string {
  let res = ''
  if (bytes >= 1073741824) res = `${(bytes / 1073741824).toFixed(2)} GB`
  else if (bytes >= 1048576) res = `${(bytes / 1048576).toFixed(2)} MB`; else if (bytes >= 1024) res = `${(bytes / 1024).toFixed(2)} KB`; else if (bytes > 1) res = `${bytes} bytes`; else if (bytes === 1) res = `${bytes} byte`; else res = '0 bytes'
  return res
}

export function jsonClone<T>(val: T): T {
  return JSON.parse(JSON.stringify(val))
}

export const isSupportImg = (key: string) => /\.(png|jpg|jpeg|webp)$/i.test(key)
