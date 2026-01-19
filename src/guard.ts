import router from '@/router'
import { getToken } from '@/util/authUtil'
import { useAuthStore } from '@/stores/auth'

const WHITE_LIST = ['/', '/401', '/404']

router.beforeEach(async (to) => {
  const token = getToken()
  const authStore = useAuthStore()

  // 1. public 页面直接放行
  if (to.meta?.public) {
    return true
  }

  // 2. 未登录
  if (!token) {
    if (WHITE_LIST.includes(to.path)) {
      return true
    }
    return { path: '/', replace: true }
  }

  // 3. 已登录，但用户信息未加载（正常流程）
  if (token && !authStore.isUserInfoLoaded) {
    try {
      await authStore.getUserInfo()
    } catch (e) {
      authStore.logout()
      return { path: '/', replace: true }
    }
  }

  // 4. 权限校验
  const roles = to.meta?.roles
  if (Array.isArray(roles) && roles.length > 0) {
    if (!roles.includes(authStore.userRole)) {
      return { path: '/401', replace: true }
    }
  }

  return true
})
