import { setToken, removeToken } from '@/util/authUtil'
import { defineStore } from 'pinia'
import { loginApi, registerApi, getUserInfoApi } from '@/api/user/user'
import router from '@/router'
import type { User } from '@/types/user/user.type'
import { loadUserRoutes } from '@/util/routerUtil'

interface UserState {
  token: string | null
  userInfo: User | null
  userRole: string | null

  isUserInfoLoaded: boolean
  isRouteAdded: boolean

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
    async login(credentials: { email: string; password: string }) {
      const res = await loginApi(credentials)
      const { accessToken, user } = res
      console.log('[Auth Debug] Login response:', { accessToken, user })

      this.token = accessToken
      setToken(accessToken)

      this.userInfo = user
      this.userRole = user.role
      this.isUserInfoLoaded = true
      this.isRouteAdded = false

      this.isAuthOpen = false

      // 动态路由加载
      const targettPath = await loadUserRoutes(this.userRole!, true)

      router.replace(targettPath)
      this.isRouteAdded = true

      return res
    },

    async register(credentials: { email: string; password: string; role: string }) {
      const res = await registerApi(credentials)
      const { accessToken, user } = res

      this.token = accessToken
      setToken(accessToken)

      this.userInfo = user
      this.userRole = user.role
      this.isUserInfoLoaded = true
      this.isRouteAdded = false

      this.isAuthOpen = false

      const targettPath = await loadUserRoutes(this.userRole!, true)
      this.isRouteAdded = true

      router.replace(targettPath)

      return res
    },
    async getUserInfo() {
      const res = await getUserInfoApi()
      this.userInfo = res.user
      this.userRole = res.user.role
      this.isUserInfoLoaded = true
      return res
    },

    setUserInfo(user: User) {
      this.userInfo = user
      this.userRole = user.role
      this.isUserInfoLoaded = true
    },

    logout() {
      removeToken()
      const targetPath = '/'
      router.replace(targetPath)
      router.afterEach(() => {
        if (router.currentRoute.value.path === targetPath) {
          this.token = null
          this.userInfo = null
          this.userRole = null
          this.isUserInfoLoaded = false
          this.isRouteAdded = false
          this.isAuthOpen = false
        }
      })
    },

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
