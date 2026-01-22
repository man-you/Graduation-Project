import { setToken, removeToken } from '@/util/authUtil'
import { defineStore } from 'pinia'
import { loginApi, registerApi, getUserInfoApi } from '@/api/user/user'
import router from '@/router'
import { ROLE_HOME_MAP } from '@/router/config/roleHomeMap'
import { nextTick } from 'vue'
import type { User } from '@/types/user/user.type'

// store状态接口
interface UserState {
  token: string | null
  userInfo: User | null
  userRole: string | null

  // 权限系统关键状态
  isUserInfoLoaded: boolean
  isRouteAdded: boolean

  // 模态状态
  isAuthOpen: boolean
  authMode: 'login' | 'register'
}

export const useAuthStore = defineStore('auth', {
  state: (): UserState => ({
    token: null,
    userInfo: null,
    userRole: null,

    isUserInfoLoaded: false,
    isRouteAdded: false,

    isAuthOpen: false,
    authMode: 'login',
  }),

  actions: {
    // 登录
    async login(credentials: { email: string; password: string }) {
      const res = await loginApi(credentials)

      console.log(res)

      const { accessToken, user } = res
      this.token = accessToken

      setToken(accessToken)

      this.userInfo = user
      this.userRole = user.role
      this.isUserInfoLoaded = true

      // 登录成功后，动态路由应重新评估
      this.isRouteAdded = false

      this.isAuthOpen = false

      // 跳转
      const role = this.userRole

      const targetPath = role && ROLE_HOME_MAP[role] ? ROLE_HOME_MAP[role] : '/'

      console.log('targetPath', targetPath)

      router.replace(targetPath)

      return res
    },

    // 注册（注册即登录）
    async register(credentials: { email: string; password: string; role: string }) {
      const res = await registerApi(credentials)

      const { accessToken, user } = res

      // 1. token
      this.token = accessToken
      setToken(accessToken)

      // 2. 用户信息
      this.userInfo = user
      this.userRole = user.role
      this.isUserInfoLoaded = true

      // 3. 动态路由重置
      this.isRouteAdded = false

      // 4. 关闭模态
      this.isAuthOpen = false

      // 5. 跳转
      const role = this.userRole
      const targetPath = role && ROLE_HOME_MAP[role] ? ROLE_HOME_MAP[role] : '/'
      router.replace(targetPath)

      return res
    },
    // 拉取用户信息（供路由守卫调用）
    async getUserInfo() {
      const res = await getUserInfoApi()

      console.log('res', res)

      console.log('response', res)

      this.userInfo = res.user
      this.userRole = res.user.role
      this.isUserInfoLoaded = true

      return res
    },

    // 更新用户信息
    setUserInfo(user: User) {
      this.userInfo = user
      this.userRole = user.role
      this.isUserInfoLoaded = true
    },

    // 登出
    logout() {
      this.token = null
      this.userInfo = null
      this.userRole = null

      this.isUserInfoLoaded = false
      this.isRouteAdded = false

      this.isAuthOpen = false
      removeToken()

      // 使用nextTick确保状态更新完成后再跳转
      nextTick(() => {
        router.replace('/')
      })
    },
    // UI 行为
    openAuth(mode: 'login' | 'register') {
      this.isAuthOpen = true
      this.authMode = mode
    },

    closeAuth() {
      this.isAuthOpen = false
    },

    toggleMode() {
      this.authMode = this.authMode === 'login' ? 'register' : 'login'
    },
  },
})
