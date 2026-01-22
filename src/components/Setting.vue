<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- ================= 左侧：学习身份卡（固定高度） ================= -->
      <aside
        class="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white shadow-sm p-6 h-[520px] sticky top-24"
      >
        <!-- 头像 -->
        <div class="flex flex-col items-center text-center">
          <div class="relative group">
            <img
              :src="authStore.userInfo?.avatarUrl || defaultAvatar"
              class="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
            />

            <!-- 更换头像 -->
            <button
              @click="changeAvatar"
              class="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow"
            >
              <PhCamera size="16" weight="bold" />
            </button>
          </div>

          <h3 class="mt-3 text-lg font-semibold text-slate-900">
            {{ form.userName || '未设置用户名' }}
          </h3>

          <span class="mt-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {{ form.role === 'teacher' ? '教师' : '学生' }}
          </span>

          <p class="text-xs text-slate-400 mt-2">
            {{ form.email || '-' }}
          </p>
        </div>

        <div class="my-4 border-t border-slate-200" />

        <!-- 只读信息 -->
        <div class="space-y-2 text-sm leading-tight">
          <div class="flex justify-between">
            <span class="text-slate-500">手机号</span>
            <span class="text-slate-900">
              {{ form.phone || '未填写' }}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-slate-500">个人简介</span>
            <span class="text-slate-900 truncate max-w-[160px]" :title="form.bio">
              {{ form.bio || '暂无' }}
            </span>
          </div>
        </div>
      </aside>

      <!-- ================= 右侧：设置区域 ================= -->
      <section class="lg:col-span-2 space-y-6 min-h-[520px]">
        <!-- 标签页 -->
        <div class="border-b border-slate-200">
          <nav class="-mb-px flex space-x-8">
            <button @click="activeTab = 'profile'" :class="tabClass('profile')">个人信息</button>
            <button @click="activeTab = 'security'" :class="tabClass('security')">安全设置</button>
          </nav>
        </div>

        <!-- ================= 个人信息 ================= -->
        <div
          v-show="activeTab === 'profile'"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[420px]"
        >
          <h2 class="section-title">
            <span class="bar bg-blue-500" />
            个人信息
          </h2>

          <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="form-label">用户名</label>
              <input v-model="form.userName" class="form-input" required />
            </div>

            <div>
              <label class="form-label">邮箱</label>
              <input v-model="form.email" class="form-input opacity-70" readonly />
            </div>

            <div>
              <label class="form-label">手机号</label>
              <input v-model="form.phone" class="form-input" />
            </div>

            <div>
              <label class="form-label">角色</label>
              <input
                :value="form.role === 'teacher' ? '教师' : '学生'"
                class="form-input opacity-70"
                readonly
              />
            </div>

            <div class="md:col-span-2">
              <label class="form-label">个人简介</label>
              <textarea
                v-model="form.bio"
                class="form-input resize-y min-h-[80px]"
                placeholder="介绍一下自己..."
              />
            </div>

            <div class="md:col-span-2 pt-2 flex justify-center">
              <button type="submit" :disabled="saving" class="btn-primary w-40">
                {{ saving ? '保存中...' : '保存更改' }}
              </button>
            </div>
          </form>
        </div>

        <!-- ================= 安全设置 ================= -->
        <div
          v-show="activeTab === 'security'"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[420px]"
        >
          <h2 class="section-title">
            <span class="bar bg-red-500" />
            安全设置
          </h2>

          <form
            @submit.prevent="updateSecuritySettings"
            class="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label class="form-label">邮箱</label>
              <input
                v-model="securityForm.email"
                type="email"
                class="form-input"
                placeholder="输入新的邮箱地址"
              />
            </div>

            <div>
              <label class="form-label">当前密码</label>
              <input v-model="securityForm.currentPassword" type="password" class="form-input" />
            </div>

            <div>
              <label class="form-label">新密码</label>
              <input v-model="securityForm.newPassword" type="password" class="form-input" />
            </div>

            <div>
              <label class="form-label">确认新密码</label>
              <input v-model="securityForm.confirmNewPassword" type="password" class="form-input" />
            </div>

            <div class="md:col-span-2 pt-6 flex justify-center">
              <button
                type="submit"
                :disabled="saving"
                class="btn-primary w-40 bg-blue-600 hover:bg-blue-700"
              >
                {{ saving ? '保存中...' : '更新设置' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import defaultAvatar from '@/assets/R.png'

const authStore = useAuthStore()
const activeTab = ref<'profile' | 'security'>('profile')
const saving = ref(false)

const form = reactive({
  userName: '',
  email: '',
  phone: '',
  bio: '',
  role: '',
  avatarUrl: '',
})

const securityForm = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

const updateFormFromUserInfo = () => {
  if (!authStore.userInfo) return
  Object.assign(form, authStore.userInfo)
  securityForm.email = authStore.userInfo?.email || ''
}

onMounted(updateFormFromUserInfo)
watch(() => authStore.userInfo, updateFormFromUserInfo)

const updateProfile = async () => {
  saving.value = true
  try {
    await new Promise((r) => setTimeout(r, 800))
    Object.assign(authStore.userInfo, form)
    alert('资料更新成功')
  } finally {
    saving.value = false
  }
}

const updateSecuritySettings = async () => {
  let hasUpdate = false

  // 检查是否需要更新邮箱
  if (securityForm.email && securityForm.email !== authStore.userInfo?.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(securityForm.email)) {
      alert('请输入有效的邮箱地址')
      return
    }

    // 更新邮箱
    if (authStore.userInfo) {
      authStore.userInfo.email = securityForm.email
      form.email = securityForm.email // 同时更新个人信息表单
    }
    hasUpdate = true
  }

  // 检查是否需要更新密码
  if (securityForm.newPassword) {
    if (securityForm.newPassword !== securityForm.confirmNewPassword) {
      alert('两次密码不一致')
      return
    }

    // 这里应该有实际的密码更新逻辑
    // 模拟更新过程
    hasUpdate = true
  }

  if (!hasUpdate) {
    alert('请填写要更新的信息')
    return
  }

  saving.value = true
  try {
    await new Promise((r) => setTimeout(r, 800))
    alert('安全设置更新成功')

    // 清空表单
    Object.assign(securityForm, {
      email: authStore.userInfo?.email || '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    })
  } finally {
    saving.value = false
  }
}

const changeAvatar = () => {
  alert('头像上传功能待实现')
}

const tabClass = (key: string) => [
  'py-2 px-1 text-sm font-medium border-b-2 transition',
  activeTab.value === key
    ? 'border-blue-500 text-blue-600'
    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
]
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-slate-600 mb-1;
}

.form-input {
  @apply w-full rounded-lg border border-slate-200
         bg-white px-3 py-2
         text-slate-900
         placeholder:text-slate-400
         focus:outline-none focus:ring-2 focus:ring-blue-400;
}

.btn-primary {
  @apply bg-blue-600 text-white px-6 py-2 rounded-xl font-medium
         hover:bg-blue-700 shadow-sm hover:shadow
         transition-all
         disabled:opacity-60 disabled:cursor-not-allowed;
}

.section-title {
  @apply text-lg font-semibold text-slate-900 flex items-center gap-2 mb-6;
}

.bar {
  @apply w-1.5 h-6 rounded-full;
}
</style>
