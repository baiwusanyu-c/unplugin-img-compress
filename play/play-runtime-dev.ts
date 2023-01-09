import { resolve } from 'path'
import { devCompressImg } from '@unplugin-img-compress/core'
devCompressImg({
  APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
  dir: `${resolve()}/src/runtime-dev-assets`,
  runtime: 'dev',
  mode: 'watch',
})
