import * as path from 'path'
import { series } from 'gulp'
import fs, { copySync } from 'fs-extra'
import pkg from '../package.json'
import { run } from './utils'
import { parallelTask } from './rewirte-path'

const moveDistToRoot = async() => {
  const distPathInBuild = path.resolve(process.cwd(), 'dist')
  const distPathToRoot = path.resolve(process.cwd(), '../dist')
  await copySync(distPathInBuild, distPathToRoot)
}

const movePkgToRootDist = async() => {
  const pkgPathToRoot = path.resolve(process.cwd(), '../dist')
  const content = JSON.parse(JSON.stringify(pkg))
  Reflect.deleteProperty(content, 'scripts')
  Reflect.deleteProperty(content, 'lint-staged')
  Reflect.deleteProperty(content, 'devDependencies')
  Reflect.deleteProperty(content, 'eslintConfig')
  content.scripts = {
    publish: 'pnpm publish --no-git-checks --access public',
  }
  await fs.writeJson(`${pkgPathToRoot}/package.json`, content, { spaces: 2 })
}
export default series(
  ...parallelTask(),
  // 移动dist
  async() => {
    const res = await moveDistToRoot()
    return res
  },
  // 移动 package.json 到 dist
  async() => {
    const res = await movePkgToRootDist()
    return res
  },
  // 删build目录下dist
  async() => {
    const res = await run('pnpm run --filter @unplugin-img-compress/build clean')
    return res
  },
)
