English | [中文](https://github.com/baiwusanyu-c/unplugin-img-compress/blob/master/README-CN.md)

# unplugin-img-compress
Image compression plugin based on tinypng
```shell
✨ : unplugin-img-compress running...[runtime dev]
✔ : compression complete [test1.png]
✅ : [74.31 KB] -> [66.64 KB]
✔ : compression complete [test2.png]
✅ : [86.52 KB] -> [76.64 KB]
```

## Feature

* 🌈 Compatible with multiple bundled platforms（vite、rollup、esbuild、webpack）
* 🌌 Support for compressing pictures in the product when packaging
* 🌊 Support image compression during development
* ⛰ Support png|jpg|jpeg|webp

## Install

```bash
npm i unplugin-img-compress -D
```
Or
```bash
yarn add unplugin-img-compress -D
```
Or
```bash
pnpm add unplugin-img-compress -D
```

## Usage
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

## Option

```typescript
export interface CompressOption{
  APIKey: string
  dir: string | string[]
  runtime: 'build' | 'dev'
  mode: 'watch' | 'once'
}
```

### APIKey
The secret key to call tinypng Api ([See: https://tinypng.com/developers](https://tinypng.com/developers))

### dir
The image target file path that needs to be compressed. e.g. `'src/assets/img'`

### runtime
Specifies whether the plug-in is run in the form of `cli` or a plug-in of a packaging tool.  
When it is set to `dev`, it will no longer run when the packaging tool is packaged (such as vite).  
If you want to compress the image when packaging, please set it to `build`,  
If you want to run independently in the form of `cli` to compress images during development,   
please set it to `dev`  
([More information](https://github.com/baiwusanyu-c/unplugin-img-compress/blob/master/README-CN.md#CliMode))

### mode
Specifies whether to enable file monitoring. When `mode` is `once`,   
`unplugin-img-compress` will stop after executing once.  
When `mode` is `watch`, `unplugin-img-compress` will monitor the changes of the images in the target image folder,  
and automatically compress the newly added images.  
([More information](https://github.com/baiwusanyu-c/unplugin-img-compress/blob/master/README-CN.md#CliMode))

## Cli Mode
`unplugin-img-compress` also provides a way to run scripts（inspired by [easy-tinypng-cli](https://github.com/sudongyuer/easy-tinypng-cli)）
### Usage
1.Configuration file `unplugin-img-compress.config.ts` (supports '.ts', '.mts', '.cts', '.js', '.mjs', '.cjs', '.json')
```typescript
export default {
  APIKey: 'xxxxx',
  dir: `/src/runtime-dev-assets`,
  runtime: 'dev',
  mode: 'watch',
}
```
Its configuration is no different, except here you need to set `runtime` to `dev`

2.run script
```shell
pnpm unp-img
✨ : unplugin-img-compress running...[runtime dev]
✔ : compression complete [test1.png]
✅ : [74.31 KB] -> [66.64 KB]
✔ : compression complete [test2.png]
✅ : [86.52 KB] -> [76.64 KB]
```
When the script finishes running, a record file `IMG_TINIFY_RECORD.json` will be created in the project root directory

### Option

#### -c | --clear
Delete the record file `IMG_TINIFY_RECORD.json` every time the script runs
```shell
pnpm unp-img -c|--clear
```
### Notice
When `mode` is set to `watch`, `unplugin-img-compress` will only monitor the addition and deletion of files.  
When a new file is added, the record file `IMG_TINIFY_RECORD.json` will be updated and the newly added file will be compressed.    
When a file is deleted, then only the record file will be updated.  
I don't recommend you to modify the file name during script execution (`mode = watch`),  
because `unplugin-img-compress` internally monitors the file using`chokidar`,  
the modification of the file name will trigger `change` and `add` events,   
and I have no way of knowing the information before and after the modification of the file,   
so I cannot update it correctly or accurately distinguish whether the file needs to be compressed.  
Therefore, I recommend renaming the files outside the project before putting them into the project.

## Thanks
* [tinypng](https://tinypng.com/)
* [easy-tinypng-cli](https://github.com/sudongyuer/easy-tinypng-cli)
* [unplugin](https://github.com/unjs/unplugin)
