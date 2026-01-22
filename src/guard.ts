import { getAccessibleRoutes, addDynamicRoutes } from '@/util/guardUtil'
import { useAuthStore } from '@/stores/auth'
import { getToken } from '@/util/authUtil'
import router from '@/router'
import { nextTick } from 'vue'
import { ROLE_HOME_MAP } from '@/router/config/roleHomeMap' // 确保已导入

const WHITE_LIST = ['/', '/401', '/404']

router.beforeEach(async (to) => {
  console.log('[路由守卫] 开始处理:', to.path)
  console.log('[路由守卫] 当前状态:', {
    token: !!getToken(),
    isUserInfoLoaded: useAuthStore().isUserInfoLoaded,
    isRouteAdded: useAuthStore().isRouteAdded,
    userRole: useAuthStore().userRole,
  })

  const token = getToken()
  const authStore = useAuthStore()

  // if (to.meta?.public) return true

  if (!token) {
    return WHITE_LIST.includes(to.path) ? true : { path: '/', replace: true }
  }

  // 阶段1: 确保用户信息已加载
  if (!authStore.isUserInfoLoaded) {
    try {
      await authStore.getUserInfo()
      // 用户信息加载完成，重新导航以进入下一阶段
      return { ...to, replace: true }
    } catch (error) {
      console.error('获取用户信息失败:', error)
      authStore.logout()
      return { path: '/', replace: true }
    }
  }

  // 阶段2: 确保动态路由已添加
  if (!authStore.isRouteAdded) {
    const routes = getAccessibleRoutes(authStore.userRole)
    addDynamicRoutes(routes)
    authStore.isRouteAdded = true

    // 确保路由表更新
    await nextTick()

    // 关键修复：重定向到角色首页，而不是继续导航到当前路径
    const role = authStore.userRole
    const targetPath = role && ROLE_HOME_MAP[role] ? ROLE_HOME_MAP[role] : '/'

    // 如果当前路径是404，直接跳转到角色首页
    if (to.path === '/404') {
      return { path: targetPath, replace: true }
    }

    // 否则继续当前导航
    return { ...to, replace: true }
  }

  // 阶段3: 权限校验
  const roles = to.meta?.roles
  if (Array.isArray(roles) && !roles.includes(authStore.userRole)) {
    return { path: '/401', replace: true }
  }

  return true
})
