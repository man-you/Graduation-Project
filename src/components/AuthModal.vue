<template>
  <Transition name="fade-slide-up">
    <div v-if="isAuthOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <!-- 背景遮罩 -->
      <div
        class="absolute inset-0 bg-slate-900/10 dark:bg-black/50 backdrop-blur-sm"
        @click="closeAuthModal"
      ></div>

      <!-- 模态框 -->
      <div
        class="relative w-full max-w-[480px] bg-white dark:bg-slate-800 rounded-3xl p-12 shadow-2xl dark:shadow-slate-700 border border-slate-100 dark:border-slate-700"
      >
        <!-- 关闭按钮 -->
        <button
          @click="closeAuthModal"
          class="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <PhX size="24" class="text-indigo-600 dark:text-indigo-400" />
        </button>

        <!-- 标题 -->
        <div class="mb-8">
          <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {{ authMode === 'login' ? '欢迎回来' : '免费注册' }}
          </h3>
          <p class="text-sm text-slate-500 dark:text-slate-300">
            {{ authMode === 'login' ? '继续你的个性化学习之旅' : '开启智能学习新篇章' }}
          </p>
        </div>

        <!-- 错误信息显示区域 -->
        <div
          v-if="errorMessage"
          class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
        >
          <div class="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ errorMessage }}
          </div>
        </div>

        <!-- 表单 -->
        <form @submit.prevent="handleAuthSubmit" class="space-y-6">
          <!-- 邮箱 -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 ml-1"> 电子邮箱 </label>
            <input
              v-model="email"
              type="email"
              placeholder="请输入您的邮箱"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <!-- 密码 -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 ml-1"> 密码 </label>
            <input
              v-model="password"
              type="password"
              placeholder="请输入您的密码"
              class="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <!-- 角色选择（仅注册时显示） -->
          <div v-if="authMode === 'register'" class="space-y-2">
            <label class="text-xs font-bold text-slate-500 ml-1"> 注册身份 </label>

            <div class="flex gap-4">
              <button
                type="button"
                class="flex-1 py-3 rounded-xl border font-semibold transition-all"
                :class="
                  role === 'student'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                "
                @click="role = 'student'"
              >
                学生
              </button>

              <button
                type="button"
                class="flex-1 py-3 rounded-xl border font-semibold transition-all"
                :class="
                  role === 'teacher'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                "
                @click="role = 'teacher'"
              >
                教师
              </button>
            </div>
          </div>

          <!-- 提交按钮 -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {{
              loading
                ? authMode === 'login'
                  ? '登录中...'
                  : '注册中...'
                : authMode === 'login'
                  ? '立即登录'
                  : '立即注册'
            }}
          </button>
        </form>

        <!-- 切换登录 / 注册 -->
        <div class="mt-8 border-t border-slate-100 flex flex-col gap-3 pt-4">
          <button
            class="w-full py-3 border border-slate-200 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            @click="toggleMode"
          >
            {{ authMode === 'login' ? '去注册' : '去登录' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { storeToRefs } from 'pinia'
import { PhX } from '@phosphor-icons/vue'

const authStore = useAuthStore()
const { isAuthOpen, authMode } = storeToRefs(authStore)

const email = ref('')
const password = ref('')
const role = ref<'student' | 'teacher'>('student')

const loading = ref(false)
const errorMessage = ref('')

// 关闭模态框
const closeAuthModal = () => {
  authStore.closeAuth()
  errorMessage.value = ''
}

// 切换登录 / 注册
const toggleMode = () => {
  errorMessage.value = ''
  role.value = 'student'
  authStore.toggleMode()
}

// 提交表单
const handleAuthSubmit = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = '请输入邮箱和密码'
    return
  }

  try {
    loading.value = true

    if (authMode.value === 'login') {
      await authStore.login({
        email: email.value,
        password: password.value,
      })
    } else {
      const data = {
        email: email.value,
        password: password.value,
        role: role.value,
      }

      console.log('data', data)

      await authStore.register({
        email: email.value,
        password: password.value,
        role: role.value,
      })
    }

    email.value = ''
    password.value = ''
    role.value = 'student'
  } catch (error: unknown) {
    // 根据统一响应格式处理错误
    let code: string | number | undefined
    let message: string | undefined
    
    if (error instanceof Error) {
      // 检查是否是自定义错误对象
      const customError = error as { code?: string | number; response?: { status: number } }
      code = customError.code || customError.response?.status
      message = error.message
    }
    
    if (code === 409) {
      errorMessage.value = '该邮箱已被注册'
    } else if (code === 401) {
      errorMessage.value = '邮箱或密码错误'
    } else {
      errorMessage.value = message || '操作失败，请稍后重试'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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
