import studentRoutes from '@/router/module/student'
import teacherRoutes from '@/router/module/teacher'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

const dynamicRouteNames: string[] = []

// 根据用户角色获取可访问的动态路由
export const getAccessibleRoutes = (userRole: string | null) => {
  let accessibleRoutes: any[] = []
  switch (userRole) {
    case 'student':
      accessibleRoutes = [...accessibleRoutes, ...studentRoutes]
      break
    case 'teacher':
      accessibleRoutes = [...accessibleRoutes, ...teacherRoutes]
      break

    // case 'admin':
    //   accessibleRoutes = [...accessibleRoutes, ...studentRoutes, ...teacherRoutes]
    //   break

    default:
      break
  }
  return accessibleRoutes
}

// 添加动态路由
export const addDynamicRoutes = (routes: RouteRecordRaw[]) => {
  routes.forEach((route) => {
    if (route.name && !router.hasRoute(route.name)) {
      router.addRoute(route)
      // 确保记录动态路由名称
      if (!dynamicRouteNames.includes(route.name as string)) {
        dynamicRouteNames.push(route.name as string)
      }
    }
  })
}
// 清空所有所有动态路由
export function resetDynamicRoutes() {
  dynamicRouteNames.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  dynamicRouteNames.length = 0
}
