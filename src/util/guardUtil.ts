import studentRoutes from '@/router/module/student'
import teacherRoutes from '@/router/module/teacher'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

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
    if (!router.hasRoute(route.name!)) {
      router.addRoute(route)
    }
  })
}

// 清空所有所有动态路由
export const removeDynamicRoutes = () => {
  router.replace({ path: '/404' }).then(() => {
    location.reload()
  })
}
