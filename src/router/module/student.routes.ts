import type { RouteRecordRaw } from 'vue-router'

export const studentChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'courses',
    name: 'StudentCourses',
    component: () => import('@/views/student/CourseList.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'graphs',
    name: 'StudentKnowledges',
    component: () => import('@/views/public/Graph.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'files',
    name: 'StudentFiles',
    component: () => import('@/views/public/FileManager.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'assistant',
    name: 'StudentChat',
    component: () => import('@/views/public/Chat.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'settings',
    name: 'StudentSettings',
    component: () => import('@/views/setting/Setting.vue'),
    meta: { roles: ['student'] },
  },
]

export default studentChildrenRoutes
