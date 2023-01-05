import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { imgCompress } from '@unplugin-img-compress/core'
import type { PluginOption } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    imgCompress({
      type: 'vite',
      APIKey: '',
      dir: '',
      runtime: 'build',
      mode: 'once',
    }) as PluginOption,
  ],
})
