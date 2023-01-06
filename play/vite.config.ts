import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { viteImgCompress } from '../dist'
import type { PluginOption } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteImgCompress({
      APIKey: 'kZgn8pxfdjQjKFmf2StLq7CY4TqMgs0T',
      dir: `${resolve()}/assets`,
      runtime: 'build',
      mode: 'once',
    }) as PluginOption,
  ],
})
