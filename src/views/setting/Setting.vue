<template>
  <div
    class="min-h-screen bg-[#F8FAFC] dark:bg-[#06080f] text-slate-900 dark:text-slate-100 antialiased transition-colors duration-300"
  >
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside class="lg:col-span-4 lg:sticky lg:top-10 transition-all duration-500">
          <div
            class="overflow-hidden rounded-[2.5rem] border border-blue-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-blue-100/30 dark:shadow-none"
          >
            <div
              class="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-950"
            >
              <div
                class="absolute inset-0 opacity-20"
                style="
                  background-image: radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0);
                  background-size: 16px 16px;
                "
              ></div>

              <div class="absolute -bottom-10 left-8">
                <div class="relative group">
                  <div
                    class="absolute -inset-1 rounded-[2rem] bg-blue-200/30 dark:bg-blue-500/10 blur transition group-hover:opacity-100"
                  ></div>
                  <img
                    :src="authStore.userInfo?.avatarUrl || defaultAvatar"
                    class="relative w-24 h-24 rounded-[1.8rem] border-4 border-white dark:border-slate-900 object-cover shadow-lg"
                  />
                  <button
                    @click="changeAvatar"
                    class="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
                  >
                    <PhPencilSimpleLine size="16" weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            <div class="px-8 pt-14 pb-8">
              <div>
                <h3
                  class="text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none"
                >
                  {{ form.userName || '求知者' }}
                </h3>
                <div class="mt-3">
                  <span
                    :class="[
                      'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase',
                      form.role === 'teacher'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
                    ]"
                  >
                    {{ form.role === 'teacher' ? '教师' : '学生' }}
                  </span>
                </div>
              </div>

              <div class="my-8 border-t border-dashed border-slate-100 dark:border-slate-800"></div>

              <div class="space-y-6">
                <div
                  v-for="(val, label, idx) in { email: '电子邮箱', phoneNumber: '联系电话' }"
                  :key="idx"
                  class="flex items-center gap-4 group"
                >
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50/50 dark:bg-slate-800 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white"
                  >
                    <component
                      :is="label === 'email' ? PhEnvelopeSimple : PhPhone"
                      size="20"
                      weight="duotone"
                    />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {{ val }}
                    </p>
                    <p
                      class="truncate text-sm font-semibold text-slate-600 dark:text-slate-300 mt-0.5"
                    >
                      {{
                        form[label as keyof typeof form] ||
                        (label === 'phoneNumber' ? '未绑定' : '-')
                      }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4 group">
                  <div
                    class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50/50 dark:bg-slate-800 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white"
                  >
                    <PhNotebook size="20" weight="duotone" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      个人简介
                    </p>
                    <p
                      class="text-sm italic leading-relaxed text-slate-500 dark:text-slate-400 mt-1"
                    >
                      {{ form.bio || '在这个知识的海洋里，勇敢航行。' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <section class="lg:col-span-8">
          <div
            class="inline-flex items-center p-1.5 bg-slate-200/40 dark:bg-slate-800/50 rounded-2xl backdrop-blur-md mb-6"
          >
            <button
              v-for="tab in ['profile', 'security']"
              :key="tab"
              @click="activeTab = tab as any"
              :class="[
                'flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300',
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
              ]"
            >
              <component
                :is="tab === 'profile' ? PhUserFocus : PhShieldCheck"
                size="18"
                weight="bold"
              />
              {{ tab === 'profile' ? '基本资料' : '安全设置' }}
            </button>
          </div>

          <main
            class="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 px-8 py-8 lg:px-10 shadow-sm"
          >
            <Transition name="fade-slide" mode="out-in">
              <div v-if="activeTab === 'profile'" key="profile-panel">
                <div class="flex items-center justify-between mb-6">
                  <h2
                    class="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3"
                  >
                    <span class="w-1 h-5 bg-blue-500 rounded-full"></span>
                    个人信息
                  </h2>
                </div>

                <form
                  @submit.prevent="updateProfile"
                  class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"
                >
                  <div class="space-y-1.5">
                    <label class="form-label-edu">用户名</label>
                    <input v-model="form.userName" class="form-input-edu" placeholder="输入名称" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="form-label-edu"
                      >官方邮箱
                      <span class="text-[10px] text-slate-300 dark:text-slate-600 ml-2 font-normal"
                        >锁定项</span
                      ></label
                    >
                    <input v-model="form.email" readonly class="form-input-edu-readonly" />
                  </div>
                  <div class="space-y-1.5">
                    <label class="form-label-edu">手机号码</label>
                    <input
                      v-model="form.phoneNumber"
                      class="form-input-edu"
                      placeholder="138 **** ****"
                    />
                  </div>
                  <div class="space-y-1.5">
                    <label class="form-label-edu">用户角色</label>
                    <input
                      :value="form.role === 'teacher' ? '教师' : '学生'"
                      readonly
                      class="form-input-edu-readonly"
                    />
                  </div>
                  <div class="md:col-span-2 space-y-1.5">
                    <label class="form-label-edu">自我介绍</label>
                    <textarea
                      v-model="form.bio"
                      rows="2"
                      class="form-input-edu resize-none"
                      placeholder="简单介绍一下您..."
                    ></textarea>
                  </div>
                  <div
                    class="md:col-span-2 flex items-center justify-end pt-5 border-t border-slate-50 dark:border-slate-800 mt-2"
                  >
                    <button
                      type="submit"
                      :disabled="saving || !isProfileDirty"
                      class="btn-edu-primary py-2.5"
                    >
                      <PhCloudArrowUp v-if="!saving" size="18" weight="bold" class="mr-2" />
                      {{ saving ? '正在同步...' : '保存更改' }}
                    </button>
                  </div>
                </form>
              </div>

              <div v-else key="security-panel" class="max-w-xl">
                <div class="mb-6">
                  <h2
                    class="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3"
                  >
                    <span class="w-1 h-5 bg-red-400 rounded-full"></span>
                    账户安全中心
                  </h2>
                </div>
                <form @submit.prevent="updateSecuritySettings" class="space-y-4">
                  <div class="space-y-1.5">
                    <label class="form-label-edu">原密码</label>
                    <input
                      v-model="securityForm.currentPassword"
                      type="password"
                      class="form-input-edu"
                    />
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="space-y-1.5">
                      <label class="form-label-edu">新密码</label>
                      <input
                        v-model="securityForm.newPassword"
                        type="password"
                        class="form-input-edu"
                      />
                    </div>
                    <div class="space-y-1.5">
                      <label class="form-label-edu">确认新密码</label>
                      <input
                        v-model="securityForm.confirmNewPassword"
                        type="password"
                        class="form-input-edu"
                      />
                    </div>
                  </div>
                  <div class="pt-5 border-t border-slate-50 dark:border-slate-800 mt-2">
                    <button
                      type="submit"
                      :disabled="saving || !isSecurityDirty"
                      class="btn-edu-primary bg-slate-800 dark:bg-indigo-600 hover:bg-slate-900 dark:hover:bg-indigo-500 py-2.5 shadow-none"
                    >
                      更新密码
                    </button>
                  </div>
                </form>
              </div>
            </Transition>
          </main>
        </section>
      </div>
    </div>
  </div>

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
import { useAuthStore } from '@/stores/auth.store'
import ResultModal from '@/components/ResultModal.vue'
import defaultAvatar from '@/assets/R.png'
import { updateUserInfoApi, updateSafeInfoApi } from '@/api/user/user.api'
import { validateSecurityForm } from '@/util/validateSecurityForm'
import {
  PhUserFocus,
  PhShieldCheck,
  PhPencilSimpleLine,
  PhEnvelopeSimple,
  PhPhone,
  PhNotebook,
  PhCloudArrowUp,
} from '@phosphor-icons/vue'

const authStore = useAuthStore()
const activeTab = ref<'profile' | 'security'>('profile')
const saving = ref(false)

const form = reactive({ userName: '', email: '', phoneNumber: '', bio: '', role: '' })
const securityForm = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})
const initialFormSnapshot = ref('')

const takeProfileSnapshot = () => {
  initialFormSnapshot.value = JSON.stringify({
    userName: form.userName,
    phoneNumber: form.phoneNumber,
    bio: form.bio,
  })
}

const isProfileDirty = computed(() => {
  return (
    JSON.stringify({ userName: form.userName, phoneNumber: form.phoneNumber, bio: form.bio }) !==
    initialFormSnapshot.value
  )
})

const isSecurityDirty = computed(() => !!securityForm.currentPassword && !!securityForm.newPassword)

const resultModal = reactive({
  visible: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: '',
})

const showResultModal = (type: 'success' | 'error', title: string, message: string) => {
  Object.assign(resultModal, { visible: true, type, title, message })
}

const syncFromUserInfo = () => {
  if (!authStore.userInfo) return
  Object.assign(form, authStore.userInfo)
  securityForm.email = authStore.userInfo.email
  takeProfileSnapshot()
}

onMounted(syncFromUserInfo)
watch(() => authStore.userInfo, syncFromUserInfo)

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
    showResultModal('success', '同步成功', '您的基本资料已更新。')
  } catch (e: any) {
    showResultModal('error', '操作失败', e?.message || '网络连接异常')
  } finally {
    saving.value = false
  }
}

const updateSecuritySettings = async () => {
  if (!isSecurityDirty.value) return
  const validation = validateSecurityForm(securityForm, authStore.userInfo?.email)
  if (!validation.isValid) {
    showResultModal('error', '校验未通过', validation.errorMessage || '表单错误')
    return
  }
  saving.value = true
  try {
    await updateSafeInfoApi(validation.payload!)

    Object.assign(securityForm, { currentPassword: '', newPassword: '', confirmNewPassword: '' })
    showResultModal('success', '安全加固成功', '您的密码已更新。')
  } catch (e: any) {
    console.log('更新错误', e, e.message)
    showResultModal('error', '更新失败', e?.message || '请确认原始密码正确')
  } finally {
    saving.value = false
  }
}

const changeAvatar = () => {
  showResultModal('error', '暂未开放', '头像上传模块正在审查中。')
}
</script>

<style scoped>
.form-label-edu {
  @apply block text-[13px] font-bold tracking-wide text-slate-500 dark:text-slate-400 ml-0.5;
}

.form-input-edu {
  @apply w-full rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/50 px-4 py-2
         text-[14px] text-slate-700 dark:text-slate-200 outline-none transition-all duration-300
         placeholder:text-slate-300 dark:placeholder:text-slate-600
         focus:border-blue-400 dark:focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 
         focus:ring-4 focus:ring-blue-100/10 dark:focus:ring-blue-900/10;
}

.form-input-edu-readonly {
  @apply w-full rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/30 px-4 py-2
         text-[14px] text-slate-400 dark:text-slate-500 cursor-not-allowed outline-none;
}

.btn-edu-primary {
  @apply flex items-center justify-center px-8 rounded-xl bg-blue-500 text-white font-bold text-sm
         shadow-lg shadow-blue-100 dark:shadow-none transition-all duration-300 hover:bg-blue-600 
         hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

aside {
  animation: slide-in-left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
section {
  animation: slide-in-right 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards;
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.btn-edu-primary:active {
  transform: scale(0.96);
}
</style>
