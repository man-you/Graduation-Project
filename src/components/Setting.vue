<template>
  <div class="max-w-6xl mx-auto px-4 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <!-- ================= 左侧：学习身份卡 ================= -->
      <aside
        class="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50 to-white shadow-sm p-6 h-[520px] sticky top-24"
      >
        <div class="flex flex-col items-center text-center">
          <div class="relative group">
            <img
              :src="authStore.userInfo?.avatarUrl || defaultAvatar"
              class="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
            />

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

        <div class="space-y-4">
          <!-- 手机号 -->
          <div class="grid grid-cols-[64px,1fr] items-start">
            <span class="text-xs text-slate-500"> 手机号 </span>
            <div class="text-center">
              <span class="text-sm font-medium text-slate-900 relative -left-3">
                {{ form.phoneNumber || '未填写' }}
              </span>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="grid grid-cols-[64px,1fr] gap-x-3 items-start">
            <span class="text-xs text-slate-500"> 个人简介 </span>
            <p class="text-sm text-slate-900 leading-relaxed break-words">
              {{ form.bio || '暂无' }}
            </p>
          </div>
        </div>
      </aside>

      <!-- ================= 右侧 ================= -->
      <section class="lg:col-span-2 space-y-6 min-h-[480px]">
        <div class="border-b border-slate-200">
          <nav class="-mb-px flex space-x-8">
            <button @click="activeTab = 'profile'" :class="tabClass('profile')">个人信息</button>
            <button @click="activeTab = 'security'" :class="tabClass('security')">安全设置</button>
          </nav>
        </div>

        <!-- 个人信息 -->
        <div
          v-show="activeTab === 'profile'"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 min-h-[420px] h-[500px] overflow-y-auto"
        >
          <h2 class="section-title"><span class="bar bg-blue-500" />个人信息</h2>

          <form @submit.prevent="updateProfile" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">用户名</label>
              <input
                v-model="form.userName"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">邮箱</label>
              <input
                v-model="form.email"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none opacity-70"
                readonly
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">手机号</label>
              <input
                v-model="form.phoneNumber"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">角色</label>
              <input
                :value="form.role === 'teacher' ? '教师' : '学生'"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none opacity-70"
                readonly
              />
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-slate-600 mb-1">个人简介</label>
              <textarea
                v-model="form.bio"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none resize-y min-h-[80px]"
              />
            </div>

            <div class="md:col-span-2 pt-2 flex justify-center">
              <button type="submit" :disabled="saving || !isProfileDirty" class="btn-primary w-40">
                {{ saving ? '保存中...' : '保存更改' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 安全设置 -->
        <div
          v-show="activeTab === 'security'"
          class="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 min-h-[420px] h-[500px] overflow-y-auto"
        >
          <h2 class="section-title"><span class="bar bg-red-500" />安全设置</h2>

          <form @submit.prevent="updateSecuritySettings" class="grid grid-cols-1 gap-5">
            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">新邮箱</label>
              <input
                v-model="securityForm.email"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none"
                placeholder="新邮箱"
                disabled="true"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">当前密码</label>
              <input
                v-model="securityForm.currentPassword"
                type="password"
                autocomplete="new-password"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none"
                placeholder="请输入当前密码"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">新密码</label>
              <input
                v-model="securityForm.newPassword"
                type="password"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none"
                placeholder="新密码"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-600 mb-1">确认密码</label>
              <input
                v-model="securityForm.confirmNewPassword"
                type="password"
                class="w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-0 focus:outline-none"
                placeholder="确认密码"
              />
            </div>

            <div class="pt-6 flex justify-center">
              <button type="submit" :disabled="saving || !isSecurityDirty" class="btn-primary w-40">
                {{ saving ? '保存中...' : '更新设置' }}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>

  <!-- 结果模态框 -->
  <ResultModal
    :visible="resultModal.visible"
    :type="resultModal.type"
    :title="resultModal.title"
    :message="resultModal.message"
    @close="resultModal.visible = false"
  />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ResultModal from '@/components/ResultModal.vue'
import defaultAvatar from '@/assets/R.png'
import { updateUserInfoApi, updateSafeInfoApi } from '@/api/user/user'
import { validateSecurityForm } from '@/util/validateSecurityForm'

/* ================= 基础状态 ================= */
const authStore = useAuthStore()
const activeTab = ref<'profile' | 'security'>('profile')
const saving = ref(false)

/* ================= 表单 ================= */
const form = reactive({
  userName: '',
  email: '',
  phoneNumber: '',
  bio: '',
  role: '',
})

const securityForm = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

/* ================= 表单初始快照（关键） ================= */
const initialFormSnapshot = ref('')

const takeProfileSnapshot = () => {
  initialFormSnapshot.value = JSON.stringify({
    userName: form.userName,
    phoneNumber: form.phoneNumber,
    bio: form.bio,
  })
}

/* ================= 是否被修改 ================= */
const isProfileDirty = computed(() => {
  return (
    JSON.stringify({
      userName: form.userName,
      phoneNumber: form.phoneNumber,
      bio: form.bio,
    }) !== initialFormSnapshot.value
  )
})

const isSecurityDirty = computed(() => {
  return (
    !!securityForm.currentPassword ||
    !!securityForm.newPassword ||
    !!securityForm.confirmNewPassword
  )
})

/* ================= 结果模态框 ================= */
const resultModal = reactive({
  visible: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: '',
})

const showResultModal = (type: 'success' | 'error', title: string, message: string) => {
  Object.assign(resultModal, { visible: true, type, title, message })
}

/* ================= 初始化用户信息 ================= */
const syncFromUserInfo = () => {
  if (!authStore.userInfo) return

  Object.assign(form, authStore.userInfo)
  securityForm.email = authStore.userInfo.email

  takeProfileSnapshot()
}

onMounted(syncFromUserInfo)
watch(() => authStore.userInfo, syncFromUserInfo)

/* ================= 提交：个人信息 ================= */
const updateProfile = async () => {
  if (!isProfileDirty.value) return

  saving.value = true
  try {
    const res = await updateUserInfoApi({
      userName: form.userName,
      phoneNumber: form.phoneNumber,
      bio: form.bio,
    })

    authStore.setUserInfo(res)
    takeProfileSnapshot()

    showResultModal('success', '更新成功', '个人信息已保存')
  } catch (e: any) {
    showResultModal('error', '更新失败', e?.message || '请稍后重试')
  } finally {
    saving.value = false
  }
}

/* ================= 提交：安全设置 ================= */
const updateSecuritySettings = async () => {
  if (!isSecurityDirty.value) return

  const validation = validateSecurityForm(securityForm, authStore.userInfo?.email)
  if (!validation.isValid) {
    showResultModal('error', '校验失败', validation.errorMessage || '表单验证失败')
    return
  }

  saving.value = true
  try {
    const res = await updateSafeInfoApi(validation.payload!)
    authStore.setUserInfo(res)

    Object.assign(securityForm, {
      email: res.email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    })

    showResultModal('success', '更新成功', '安全设置已更新')
  } catch (e: any) {
    showResultModal('error', '更新失败', e?.message || '操作失败')
  } finally {
    saving.value = false
  }
}

/* ================= 其他 ================= */
const changeAvatar = () => {
  showResultModal('error', '暂未支持', '头像上传功能尚未实现')
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
  @apply w-full rounded-lg border border-slate-200 px-3 py-2 focus:ring-2 focus:ring-blue-400;
}
.btn-primary {
  @apply bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-60;
}
.section-title {
  @apply text-lg font-semibold flex items-center gap-2 mb-6;
}
.bar {
  @apply w-1.5 h-6 rounded-full;
}
</style>
