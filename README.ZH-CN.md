[English](https://github.com/baiwusanyu-c/unplugin-img-compress/blob/master/README.md) | 中文

# unplugin-img-compress
基于 tinypng 的图片压缩插件
```shell
✨ : unplugin-img-compress running...[runtime dev]
✔ : compression complete [test1.png]
✅ : [74.31 KB] -> [66.64 KB]
✔ : compression complete [test2.png]
✅ : [86.52 KB] -> [76.64 KB]
```

## Feature(特性)

* 🌈 支持全平台打包工具构建
* 🌌 支持打包时对产物中的图片进行压缩
* 🌊 支持开发时对图片进行压缩
* ⛰ 支持格式 png|jpg|jpeg|webp

## Install(安装)

```bash
npm i unplugin-img-compress -D
```
或
```bash
yarn add unplugin-img-compress -D
```
或
```bash
pnpm add unplugin-img-compress -D
```

## Usage(使用)
<details>
<summary>Vite</summary>

```ts
// vite.config.ts
import { resolve } from 'path'
import { defineConfig } from 'vite'
import { viteImgCompress } from 'unplugin-img-compress'
import type { PluginOption } from 'vite'
export default defineConfig({
  plugins: [
    viteImgCompress({
      APIKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
      dir: `${resolve()}/assets`,
      runtime: 'build',
      mode: 'once',
    }) as PluginOption,
  ],
})
```

</details>
<br>
<details>
<summary>Rollup</summary>

```ts
// rollup.config.js
import { resolve } from 'path'
import { rollupImgCompress } from 'unplugin-img-compress'
export default {
  plugins: [
    rollupImgCompress({
      APIKey: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
      dir: `${resolve()}/assets`,
      runtime: 'build',
      mode: 'once',
    }),
  ],
}
```

</details>
<br>
<details>
<summary>Webpack</summary>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-img-compress').webpackImgCompress({ /* options */ }),
  ],
}
```
</details>
<br>
<details>
<summary>Vue CLI</summary>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-img-compress').webpackImgCompress({ /* options */ }),
    ],
  },
}
```

</details>
<br>
<details>
<summary>esbuild</summary>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import { esbuildImgCompress } from 'unplugin-img-compress'

build({
  plugins: [esbuildImgCompress()],
})
```
</details>

## Option(配置)

```typescript
export interface CompressOption{
  APIKey: string
  dir: string | string[]
  runtime: 'build' | 'dev'
  mode: 'watch' | 'once'
}
```

### APIKey
调用 tinypng Api 的秘钥 ([See: https://tinypng.com/developers](https://tinypng.com/developers))

### dir
需要压缩的图片目标文件路径, e.g. `'src/assets/img'`

### runtime
指定插件是以 `cli` 的形式运行还是打包工具的插件运行，当他设置为`dev`时，在打包工具打包时（比如vite），它将不再运行
如果你想在打包时对图片进行压缩，这里请设置为 `build`, 
如果你想在开发期间以`cli`的形式独立运行来压缩图片，请设置为`dev`

### mode
指定是否开启文件监听，当 `mode` 为 `once`时，`unplugin-img-compress`执行一次则会停止，
当 `mode` 为 `watch`时，`unplugin-img-compress`会监听目标图片文件夹内图片的变化，对新增的图片进行自动压缩。

## Cli Mode(脚本模式)
`unplugin-img-compress`还提供了一种脚本的运行方式（灵感来自于[easy-tinypng-cli](https://github.com/sudongyuer/easy-tinypng-cli)）
### Usage(使用)
1.配置文件`unplugin-img-compress.config.ts`(支持'.ts', '.mts', '.cts', '.js', '.mjs', '.cjs', '.json')
```typescript
export default {
  APIKey: 'xxxxx',
  dir: `/src/runtime-dev-assets`,
  runtime: 'dev',
  mode: 'watch',
}
```
它的配置没有什么不同, 只不过这里你需要将 `runtime` 设置为 `dev`

2.运行脚本
```shell
pnpm unp-img
✨ : unplugin-img-compress running...[runtime dev]
✔ : compression complete [test1.png]
✅ : [74.31 KB] -> [66.64 KB]
✔ : compression complete [test2.png]
✅ : [86.52 KB] -> [76.64 KB]
```
当脚本运行完成后，会在项目根目录创建一个记录文件`IMG_TINIFY_RECORD.json`

### Option

#### -c | --clear
在脚本每次运行时删除记录文件`IMG_TINIFY_RECORD.json`
```shell
pnpm unp-img -c|--clear
```
### Notice(注意)
在 `mode` 设置为 `watch` 时，`unplugin-img-compress` 只会监听文件的新增和删除，
当文件新增时，会更新记录文件`IMG_TINIFY_RECORD.json`并对新增的文件进行压缩。当文件删除时，
则只会更新记录文件。我不推荐你在脚本执行期间（`mode = watch`）修改文件名，因为`unplugin-img-compress`内部对文件的监听使用
`chokidar`,文件名的修改会触发`change` 与 `add` 事件，而我无法知道文件修改前后的信息，因此不能正确的更新或准确的区分文件是否需要压缩。
因此我更推荐在项目外对文件重命名后再放入项目。

## Thanks(感谢)
* [tinypng](https://tinypng.com/)
* [easy-tinypng-cli](https://github.com/sudongyuer/easy-tinypng-cli)
* [unplugin](https://github.com/unjs/unplugin)
