<template>
  <nav
    class="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-700 shadow-sm"
  >
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer group">
        <!-- 图标 -->
        <div
          class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
        >
          <PhGraph size="20" class="text-white" />
        </div>

        <!-- 可选文字 -->
        <span class="text-xl font-bold tracking-tight text-slate-900 dark:text-white"> 知链 </span>
      </div>

      <!-- 菜单 -->
      <div
        class="hidden md:flex items-center gap-8 text-[15px] font-medium text-slate-600 dark:text-slate-300"
      >
        <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >学习资源</a
        >
        <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >知识图谱</a
        >
        <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >智能助手</a
        >
        <a href="#" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >学习社区</a
        >
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-4">
        <!-- 暗色模式切换按钮 -->

        <button
          @click="toggleDark"
          class="px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600 text-sm dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
        >
          <!-- 动态组件标签，用于渲染不同类型的组件 -->
          <component :is="isDark ? PhSun : PhMoon" class="w-5 h-5" />
          {{ isDark ? '亮色模式' : '暗色模式' }}
        </button>

        <button
          @click="handleLogin"
          class="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          登录
        </button>
        <button
          @click="handleRegister"
          class="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
        >
          注册
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { setLocalStorage, getLocalStorage } from '@/util/storageUtil'
import { PhSun, PhMoon } from '@phosphor-icons/vue'

const authStore = useAuthStore()
// 打开登录模态框
const handleLogin = () => {
  authStore.openAuth('login')
}

// 打开注册模态框
const handleRegister = () => {
  authStore.openAuth('register')
}

// 暗黑模式
const isDark = ref(getLocalStorage('isDark') === 'true')

watchEffect(() => {
  if (isDark.value) document.documentElement.classList.add('dark')
  else document.documentElement.classList.remove('dark')
  setLocalStorage('isDark', isDark.value)
})
const toggleDark = () => {
  isDark.value = !isDark.value
}
</script>
