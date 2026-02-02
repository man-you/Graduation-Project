import { createRouter, createWebHistory } from 'vue-router'
import type { Router } from 'vue-router'

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
    name: 'home',
    component: () => import('@/views/index.vue'),
  },
  {
    path: '/student',
    name: 'StudentLayout',
    component: () => import('@/views/public/Home.vue'),
    meta: { roles: ['student'] },
    children: [],
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
  // ⚠️ 注意：
  // 这个兜底路由不能直接放在 constantRoutes 里，
  // 否则会在动态路由 addRoute 之前注册，导致 student / teacher 等动态路由无法匹配
  // { path: '/:pathMatch(.*)*', redirect: '/404', hidden: true },
]

// 统一封装：创建 router 的工厂函数
// 作用：
// 1. 保证 router 初始化顺序稳定
// 2. 保证 resetRouter 后 404 兜底依然存在
function createAppRouter(): Router {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constantRoutes,
    // 滚动行为：每次路由切换时，滚动到顶部
    scrollBehavior: () => ({ top: 0 }),
  })

  // 吞噬型兜底路由：必须在 router 创建完成后、所有业务路由之前统一注册

  return router
}

const router = createAppRouter()

//  重置路由 resetRouter()
//  使用场景：
//  - 用户退出登录
//  - 切换角色
//  - 清空动态路由
export function resetRouter() {
  const newRouter = createAppRouter()
  //  将新路由实例的内部状态复制到旧 router 上
  //  保证已有 app.use(router) 不失效
  Object.assign(router, newRouter)
}

export default router
