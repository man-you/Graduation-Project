<template>
  <Transition name="fade-slide-up">
    <div v-if="isAuthOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <!-- 除了模态框外，其他内容都用这个背景遮罩，也就是说点击后都会进行关闭 -->
      <div
        class="absolute inset-0 bg-slate-900/10 dark:bg-black/50 backdrop-blur-sm"
        @click="closeAuthModal"
      ></div>
      <div
        class="relative w-full max-w-[480px] bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl dark:shadow-slate-700 border border-slate-100 dark:border-slate-700"
      >
        <button
          @click="closeAuthModal"
          class="absolute top-6 right-6 text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <PhX size="24" class="text-indigo-600 dark:text-indigo-400" />
        </button>

        <div class="mb-8">
          <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {{ authMode === 'login' ? '欢迎回来' : '免费注册' }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-300">
            {{ authMode === 'login' ? '继续你的个性化学习之旅' : '开启智能学习新篇章' }}
          </p>
        </div>

        <form @submit.prevent class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1"
              >电子邮箱</label
            >
            <input
              type="email"
              placeholder="请输入您的邮箱"
              class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 transition-all"
            />
          </div>
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 dark:text-slate-300 ml-1">密码</label>
            <input
              type="password"
              placeholder="请输入您的密码"
              class="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-400 transition-all"
            />
          </div>
          <button
            class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all mt-4"
            @click="handleAuthSubmit"
          >
            {{ authMode === 'login' ? '立即登录' : '立即注册' }}
          </button>
        </form>

        <div class="mt-8 border-t border-slate-100 dark:border-slate-700 flex flex-col gap-3">
          <button
            class="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            @click="logOrRes"
          >
            <span>{{ authMode === 'login' ? '去注册' : '去登录' }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script setup>
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia' // 核心：引入解构响应式的api
const authStore = useAuthStore()
const { isAuthOpen, authMode } = storeToRefs(authStore)

// 关闭模态框
const closeAuthModal = () => {
  authStore.isAuthOpen = false
}
// 切换登录和注册
const logOrRes = () => {
  authStore.toggleMode()
}
// 处理登录和注册的表单提交
const handleAuthSubmit = () => {
  if (authMode.value === 'login') {
    // 处理登录逻辑
  } else {
    // 处理注册逻辑
  }
}
</script>
<style scoped>
/* 模态框过渡动画 */
.fade-slide-up-enter-active,
.fade-slide-up-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-up-enter-from,
.fade-slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
