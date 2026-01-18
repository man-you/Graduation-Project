import router from '@/router'
import { getToken } from '@/util/authUtil'
import { useAuthStore } from '@/stores/auth'

const WHITE_LIST = ['/401', '/404', '/']

router.beforeEach((to) => {
  // 开发界面放行

  if (to.meta?.public) {
    return true
  }

  const token = getToken()
  const authStore = useAuthStore()

  // 无 token
  if (!token) {
    if (WHITE_LIST.includes(to.path)) return true
    return { path: '/', replace: true }
  }

  // 有 token 但用户信息异常
  if (!authStore.isUserInfoLoaded) {
    return { path: '/', replace: true }
  }

  // 权限校验
  const roles = to.meta?.roles

  console.log('roles', roles)
  console.log('authStore.userRole', authStore.userRole)

  if (Array.isArray(roles) && roles.length > 0) {
    if (!roles.includes(authStore.userRole)) {
      return { path: '/401', replace: true }
    }
  }

  // 路由不存在兜底
  // if (to.name && !router.hasRoute(to.name)) {
  //   return { path: '/404', replace: true }
  // }

  return true
})
