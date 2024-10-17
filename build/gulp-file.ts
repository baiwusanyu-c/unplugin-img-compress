import * as path from 'path'
import { series } from 'gulp'
import fs from 'fs-extra'
import pkg from '../packages/unplugin-img-compress/package.json'

const distRoot = path.resolve(process.cwd(), '../dist')

const movePkgToRootDist = async() => {
  const content = JSON.parse(JSON.stringify(pkg))
  Reflect.deleteProperty(content, 'scripts')
  Reflect.deleteProperty(content, 'lint-staged')
  Reflect.deleteProperty(content, 'devDependencies')
  Reflect.deleteProperty(content, 'eslintConfig')
  content.scripts = {
    'publish:npm': 'pnpm publish --no-git-checks --access public',
  }
  content.type = 'module'
  await fs.writeJson(`${distRoot}/package.json`, content, { spaces: 2 })
}

const moveReadMeToRootDist = async() => {
  const distRoot = path.resolve(process.cwd(), '../dist')
  await fs.copy(`${path.resolve('../README.md')}`, `${distRoot}/README.md`)
  await fs.copy(`${path.resolve('../README.ZH-CN.md')}`, `${distRoot}/README.ZH-CN.md`)
}

export default series(
  // 移动 package.json 到 dist
  async() => {
    const res = await movePkgToRootDist()
    return res
  },
  // 移动 readme 到 dist
  async() => {
    const res = await moveReadMeToRootDist()
    return res
  },
)
