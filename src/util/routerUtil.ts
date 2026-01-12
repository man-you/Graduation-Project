/* *
 * 路由工具类
 * 封装路由相关通用方法
 */
import router from '@/router'

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
