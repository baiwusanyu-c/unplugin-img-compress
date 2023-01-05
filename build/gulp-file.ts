import * as path from 'path'
import { series } from 'gulp'
import { copySync } from 'fs-extra'
import { run } from './utils'
import { parallelTask } from './rewirte-path'

const moveDistToRoot = async() => {
  const distPathInBuild = path.resolve(process.cwd(), 'dist')
  const distPathToRoot = path.resolve(process.cwd(), '../dist')
  await copySync(distPathInBuild, distPathToRoot)
}
export default series(
  ...parallelTask(),
  // 移动dist
  async() => {
    const res = await moveDistToRoot()
    return res
  },
  // 删build目录下dist
  async() => {
    const res = await run('pnpm run --filter @unplugin-img-compress/build clean')
    return res
  },
)
