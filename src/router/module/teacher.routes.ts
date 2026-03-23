import type { RouteRecordRaw } from 'vue-router'

export const teacherChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'settings',
    name: 'StudentSettings',
    component: () => import('@/components/UserSetting.vue'),
    meta: { roles: ['student'] },
  },
]

export default teacherChildrenRoutes
