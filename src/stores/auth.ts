import { setToken, removeToken } from '@/util/authUtil'
import { defineStore } from 'pinia'
import { loginApi, getUserInfoApi } from '@/api/mock/user'

interface UserState {
  token: string | null
  userInfo: any
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

      const { token, userInfo } = res.data

      this.token = token
      setToken(token)

      this.userInfo = userInfo
      this.userRole = userInfo.role
      this.isUserInfoLoaded = true

      // 登录成功后，动态路由应重新评估
      this.isRouteAdded = false

      this.isAuthOpen = false
      return res
    },

    // 拉取用户信息（供路由守卫调用）
    async getUserInfo() {
      const res = await getUserInfoApi()

      this.userInfo = res.data
      this.userRole = res.data.userInfo.role
      this.isUserInfoLoaded = true

      return res
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
