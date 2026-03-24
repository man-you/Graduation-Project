import type { RouteRecordRaw } from 'vue-router'

export const adminChildrenRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/AdminDashboard.vue'),
    meta: { roles: ['admin'] },
  },
  {
    path: 'users',
    name: 'UserLists',
    component: () => import('@/views/admin/UserList.vue'),
    meta: { roles: ['admin'] },
  },
  {
    path: 'settings',
    name: 'AdminSettings',
    component: () => import('@/views/setting/UserSetting.vue'),
    meta: { roles: ['admin'] },
  },
]

export default adminChildrenRoutes
