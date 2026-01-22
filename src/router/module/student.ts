import type { RouteRecordRaw } from 'vue-router'

const studentRoutes: Array<RouteRecordRaw> = [
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('@/views/study/study.vue'),
    meta: {
      title: '学生中心',
      // public: true, //  明确声明：不走权限
      roles: ['student'],
    },
    children: [
      {
        path: 'setting', // 访问路径将是 /student/setting
        alias: '/setting', // 路由别名
        name: 'StudentSetting',
        component: () => import('@/components/Setting.vue'),
        meta: {
          title: '设置',
          roles: ['teacher', 'student'],
        },
      },
    ],
  },
]

export default studentRoutes
