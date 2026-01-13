import { defineStore } from 'pinia'

// 定义认证状态的接口
interface useState {
  isAuthOpen: boolean
  authMode: 'login' | 'register'
}

// 导出认证状态管理的 Pinia store
export const useAuthStore = defineStore('auth', {
  // typeScript写法，在vue3的Pinia中的写法是用函数写法
  // ():useState  定义返回值类型
  state: (): useState => {
    return {
      isAuthOpen: false,
      authMode: 'login',
    }
  },

  // 定义修改状态的方法
  actions: {
    // 打开认证模态框并设置模式
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
