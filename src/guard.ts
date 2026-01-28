import { useAuthStore } from '@/stores/auth.store'
import { getToken } from '@/util/authUtil'
import router from '@/router'
import { ROLE_ROUTE_MAP } from '@/router/config/roleHomeMap'

const WHITE_LIST = ['/', '/401', '/404']

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const token = getToken()

  console.log('[路由守卫] 处理:', to.path, {
    token,
    isUserInfoLoaded: authStore.isUserInfoLoaded,
    isRouteAdded: authStore.isRouteAdded,
  })

  // 未登录
  if (!token) {
    return WHITE_LIST.includes(to.path) ? true : { path: '/', replace: true }
  }

  // 阶段1：加载用户信息
  if (!authStore.isUserInfoLoaded) {
    try {
      await authStore.getUserInfo()
      return { ...to, replace: true }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      authStore.logout()
      return { path: '/', replace: true }
    }
  }

  // 阶段2：动态路由加载
  if (!authStore.isRouteAdded) {
    const loader = ROLE_ROUTE_MAP[authStore.userRole! as keyof typeof ROLE_ROUTE_MAP]

    if (!loader) {
      return { path: '/401', replace: true }
    }

    const { parentName, routes } = await loader()

    routes.forEach((route) => {
      if (!router.hasRoute(route.name!)) {
        router.addRoute(parentName, route)
      }
    })

    // 通配 404 路由
    if (!router.hasRoute('NotFound')) {
      router.addRoute({
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'NotFound',
      })
    }

    authStore.isRouteAdded = true

    // 重新导航当前路径，让 router 匹配
    return { ...to, replace: true }
  }

  // 阶段3：权限校验
  const roles = to.meta?.roles
  if (Array.isArray(roles) && !roles.includes(authStore.userRole!)) {
    return { path: '/401', replace: true }
  }

  return true
})
