import type { RouteRecordRaw } from 'vue-router'

const studentRoutes: Array<RouteRecordRaw> = [
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('@/views/study/index.vue'),
    meta: {
      title: '学生中心',
      public: true, //  明确声明：不走权限
      // roles: ['student'],
    },
    // children: [
    //   {
    //     path: 'courses',
    //     name: 'StudentCourses',
    //     component: () => import('@/views/student/Courses.vue'),
    //     meta: {
    //       title: '我的课程',
    //       roles: ['student'],
    //     },
    //   },
    //   {
    //     path: 'profile',
    //     name: 'StudentProfile',
    //     component: () => import('@/views/student/Profile.vue'),
    //     meta: {
    //       title: '个人资料',
    //       roles: ['student'],
    //     },
    //   },
    // ],
  },
]

export default studentRoutes
