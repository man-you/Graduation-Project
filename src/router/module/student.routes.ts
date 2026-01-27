import type { RouteRecordRaw } from 'vue-router'

export const studentChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'settings',
    name: 'StudentSettings',
    component: () => import('@/views/setting/Setting.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'assisatant',
    name: 'StudentChat',
    component: () => import('@/views/public/Chat.vue'),
    meta: { roles: ['student'] },
  },
]

export default studentChildrenRoutes
