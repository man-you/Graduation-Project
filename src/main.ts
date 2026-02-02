import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/guard'
import { icons } from './icons/icon'
import 'remixicon/fonts/remixicon.css'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  // 注册图标
  Object.keys(icons).forEach((key) => {
    app.component(key, icons[key as keyof typeof icons])
  })

  app.use(router)
  app.mount('#app')
}

bootstrap()
