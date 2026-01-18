import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@/guard'
import { icons } from './icons'
import { getToken } from '@/util/authUtil'
import { useAuthStore } from '@/stores/auth'
import { getAccessibleRoutes, addDynamicRoutes } from '@/util/guardUtil'

async function bootstrap() {
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  // 注册图标
  Object.keys(icons).forEach((key) => {
    app.component(key, icons[key as keyof typeof icons])
  })

  const authStore = useAuthStore()
  const token = getToken()

  // 在 mount 之前准备好动态路由
  if (token) {
    try {
      await authStore.getUserInfo()

      const routes = getAccessibleRoutes(authStore.userRole)
      addDynamicRoutes(routes)

      authStore.isRouteAdded = true
    } catch (e) {
      authStore.logout()
    }
  }

  app.use(router)
  app.mount('#app')
}

bootstrap()
