import type { RouteRecordRaw } from 'vue-router'

export const teacherChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'courses',
    name: 'TeacherCourses',
    component: () => import('@/views/public/CourseList.vue'),
    meta: { roles: ['teacher'], title: '课程列表' },
  },
  {
    path: 'manage/:courseId',
    name: 'TeacherNodeManage',
    component: () => import('@/views/teacher/NodeList.vue'),
    meta: { roles: ['teacher'], title: '大纲管理' },
  },
  {
    path: 'manage/:courseId/node/:nodeId',
    name: 'TeacherNodeEdit',
    component: () => import('@/views/teacher/NodeDetail.vue'),
    meta: { roles: ['teacher'], title: '编辑节点' },
    props: true
  },
  {
    path: 'manage/:courseId/node',
    name: 'TeacherNodeCreate',
    component: () => import('@/views/teacher/NodeDetail.vue'),
    meta: { roles: ['teacher'], title: '创建节点' },
    props: true
  },
  {
    path: 'files',
    name: 'teacherFiles',
    component: () => import('@/views/public/FileManager.vue'),
    meta: { roles: ['teacher'], title: '文件管理' },
  },
  {
    path: 'assistant',
    name: 'TeacherChat',
    component: () => import('@/views/public/ChatAgent.vue'),
    meta: { roles: ['teacher'], title: 'AI 助手' },
  },
  {
    path: 'settings',
    name: 'TeacherSettings',
    component: () => import('@/views/setting/UserSetting.vue'),
    meta: { roles: ['teacher'], title: '个人设置' },
  },
]

export default teacherChildrenRoutes
