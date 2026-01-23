import studentRoutes from '@/router/module/student.routes'
import teacherRoutes from '@/router/module/teacher.routes'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'

interface DynamicRouteGroup {
  parentName: string
  routes: RouteRecordRaw[]
}

const dynamicRouteNames: string[] = []

// 根据用户角色获取可访问的动态路由（返回“分组”）
export const getAccessibleRoutes = (userRole: string | null): DynamicRouteGroup | null => {
  switch (userRole) {
    case 'student':
      return {
        parentName: 'StudentLayout',
        routes: studentRoutes,
      }
    case 'teacher':
      return {
        parentName: 'TeacherLayout',
        routes: teacherRoutes,
      }
    default:
      return null
  }
}

// 添加动态路由（挂到 parent 上）
export const addDynamicChildRoutes = (parentName: string, routes: RouteRecordRaw[]) => {
  routes.forEach((route) => {
    if (route.name && !router.hasRoute(route.name)) {
      router.addRoute(parentName, route)
      dynamicRouteNames.push(route.name as string)
    }
  })
}

// 清空所有动态路由
export function resetDynamicRoutes() {
  dynamicRouteNames.forEach((name) => {
    if (router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
  dynamicRouteNames.length = 0
}
