import type { RouteRecordRaw } from 'vue-router'

export const studentChildrenRoutes: RouteRecordRaw[] = [
  {
    path: 'courses',
    name: 'StudentCourses',
    component: () => import('@/views/public/CourseList.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'course/:id',
    name: 'StudentCourseDetail',
    component: () => import('@/views/student/CourseDetail.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'course/quiz/:nodeId',
    name: 'StudentCourseQuiz',
    component: () => import('@/views/student/CourseQuiz.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'course/analysis/:nodeId',
    name: 'StudentAnalysis',
    component: () => import('@/views/student/QuizAnalysis.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'course/summary/:nodeId',
    name: 'StudentSummary',
    component: () => import('@/views/student/CourseSummary.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'course/graphs/:id',
    name: 'StudentKnowledges',
    component: () => import('@/views/public/CourseGraph.vue'),
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
    component: () => import('@/views/public/ChatAgent.vue'),
    meta: { roles: ['student'] },
  },
  {
    path: 'settings',
    name: 'StudentSettings',
    component: () => import('@/views/setting/UserSetting.vue'),
    meta: { roles: ['student'] },
  },
]

export default studentChildrenRoutes
