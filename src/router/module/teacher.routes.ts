import type { RouteRecordRaw } from 'vue-router'

export const teacherChildrenRoutes: RouteRecordRaw[] = [
    {
    path: 'files',
    name: 'teacherFiles',
    component: () => import('@/views/public/FileManager.vue'),
    meta: { roles: ['teacher'] },
  },
    {
    path: 'assistant',
    name: 'TeacherChat',
    component: () => import('@/views/public/ChatAgent.vue'),
    meta: { roles: ['teacher'] },
  },
  {
    path: 'settings',
    name: 'TeacherSettings',
    component: () => import('@/views/setting/UserSetting.vue'),
    meta: { roles: ['teacher'] },
  },
]

export default teacherChildrenRoutes
