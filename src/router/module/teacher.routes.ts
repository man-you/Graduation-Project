import type { RouteRecordRaw } from 'vue-router'

export const teacherChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'settings',
    name: 'StudentSettings',
    component: () => import('@/components/Setting.vue'),
    meta: { roles: ['student'] },
  },
]

export default teacherChildrenRoutes
