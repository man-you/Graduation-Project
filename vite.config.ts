import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 设置基础路径，部署到子路径时使用
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // 开发服务器配置
  server: {
    port: 3000,
    // 是否自动在浏览器打开
    open: true,
    // 所有网络接口，允许外部所有设备访问
    host: '0.0.0.0',
    // 接口代理，转发到nginx服务器
    proxy: {},
  },
})
