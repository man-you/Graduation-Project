/* *
 * 路由工具类
 * 封装路由相关通用方法
 */
import router from '@/router'
import { menuList } from '@/api/mock/menu'
import { ROLE_ROUTE_MAP } from '@/router/config/roleHomeMap'

/**
 * 路由返回上一级（无上级页面则跳转首页）
 * @param fallbackPath 兜底跳转路径，默认首页
 */
export const routerBack = (fallbackPath: string = '/') => {
  if (window.history.length > 1) {
    router.go(-1) // 应该是 go(-1)，返回上一页
  } else {
    router.push(fallbackPath) // 历史记录为空时，跳转到兜底路径
  }
}
/**
 * 菜单过滤函数，只返回可访问的菜单项
 */
export const getFilteredMenuList = (userRole: string | null) => {
  // 获取用户角色
  if (!userRole) {
    return menuList.filter((item) => !item.roles || item.roles.length === 0)
  }

  // 返回当前角色有权访问的菜单项
  return menuList.filter((item) => {
    return item.isActive && (!item.roles || item.roles.includes(userRole))
  })
}

/**
 * 动态加载用户角色对应的路由
 * @param userRole 用户角色
 * @param isLogin 是否为登录操作（影响默认跳转路径）
 */
export const loadUserRoutes = async (userRole: string, isLogin: boolean = true) => {
  const loader = ROLE_ROUTE_MAP[userRole as keyof typeof ROLE_ROUTE_MAP]
  let defaultPath = isLogin ? `/${userRole}` : '/' // 登录时跳转到父路由，注册时可能跳转到其他路径

  if (loader) {
    const { parentName, routes } = await loader()
    routes.forEach((route) => {
      if (!router.hasRoute(route.name!)) {
        router.addRoute(parentName, route)
      }
    })

    if (!router.hasRoute('NotFound')) {
      router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'NotFound',
      })
    }

    // 根据操作类型设置默认路径
    if (isLogin) {
      // 登录：默认进入父路由
      defaultPath = `/${userRole}`
    } else {
      // 注册：可以进入第一个子路由或父路由
      defaultPath = routes[0]?.path || `/${userRole}`
    }
  }

  return defaultPath
}
