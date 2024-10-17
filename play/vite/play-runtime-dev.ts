import { resolve } from 'path'
import { devCompressImg } from '@unplugin-img-compress/core'
devCompressImg({
  APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
  dir: [`${resolve()}/src/runtime-dev-assets/img`, `${resolve()}/src/runtime-dev-assets/img2`],
  runtime: 'dev',
  mode: 'watch',
})
