import type { RouteRecordRaw } from 'vue-router'

export const studentChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'settings',
    name: 'StudentSettings',
    component: () => import('@/components/Setting.vue'),
    meta: { roles: ['student'] },
  },
]

export default studentChildrenRoutes
