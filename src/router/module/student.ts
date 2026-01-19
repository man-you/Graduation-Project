import type { RouteRecordRaw } from 'vue-router'

const studentRoutes: Array<RouteRecordRaw> = [
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('@/views/study/study.vue'),
    meta: {
      title: '学生中心',
      public: true, //  明确声明：不走权限
      roles: ['student'],
    },
  },
]

export default studentRoutes
