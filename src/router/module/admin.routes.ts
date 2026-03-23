import type { RouteRecordRaw } from 'vue-router'

export const adminChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'users',
    name: 'UserLists',
    component: () => import('@/views/admin/UserList.vue'),
    meta: { roles: ['admin'] },
  },
]

export default adminChildrenRoutes