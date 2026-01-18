/* *
 * 路由工具类
 * 封装路由相关通用方法
 */
import router from '@/router'
import { menuList } from '@/api/mock/menu'

/**
 * 路由返回上一级（无上级页面则跳转首页）
 * @param fallbackPath 兜底跳转路径，默认首页
 */
export const routerBack = (fallbackPath: string = '/') => {
  if (window.history.length > 1) {
    router.push(fallbackPath)
  } else {
    router.go(-1)
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
