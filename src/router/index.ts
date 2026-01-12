import { createRouter, createWebHistory } from 'vue-router'

// @符号是一种路径别名，表示src目录
// 这个通常是是在vite.config.ts中配置的

/**
 * 标准化路由配置项说明（你的项目专属，精简够用）
 * path: '/xxx'          路由访问路径
 * name: 'XxxXxx'        路由唯一名称(必填，不可重复)
 * component: 组件       路由对应页面组件
 * hidden: true          是否在导航菜单隐藏（比如详情页）
 * meta: {
 *   title: '页面名称'    面包屑/导航显示名称
 *   roles: ['student']  权限核心：能访问的角色列表
 * }
 */

/**
 * 1. 常量路由 constantRoutes 【无权限，所有人可见，包括未登录游客】
 *  项目公共路由，启动即加载，永久存在
 */
const constantRoutes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/401',
    name: 'Page401',
    component: () => import('@/views/error-page/401.vue'),
  },
  {
    path: '/404',
    name: 'Page404',
    component: () => import('@/views/error-page/404.vue'),
  },
]

/**
 * 2. 异步路由 asyncRoutes 【有权限控制，登录后动态加载】
 *  学习平台核心业务路由，全部是一级路由！
 *  学生/教师/管理员的专属页面，未登录无法访问
 *  重中之重：404路由必须放在最后一位！
 */
export const asyncRoutes = [
  //  学生端：学习中心 - 一级路由 /study
  //  studyRouter,

  //  教师端：教学管理 - 一级路由 /teacher
  //  teacherRouter,

  //  管理员端：系统管理 - 一级路由 /admin
  //  adminRouter,

  //  兜底路由，匹配所有未定义路径，放最后！
  { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...constantRoutes, ...asyncRoutes],
  // 滚动行为：每次路由切换时，滚动到顶部
  scrollBehavior: () => ({ top: 0 }),
})

//  重置路由 resetRouter()
export function resetRouter() {
  const newRouter = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [...constantRoutes, ...asyncRoutes],
  })
  //  将新路由赋值给旧路由
  Object.assign(router, newRouter)
}

export default router
