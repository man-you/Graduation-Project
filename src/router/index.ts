import { createRouter, createWebHistory } from 'vue-router'

// @符号是一种路径别名，表示src目录
// 这个通常是是在vite.config.ts中配置的
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
