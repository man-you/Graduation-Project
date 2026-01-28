<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased">
    <div class="max-w-7xl mx-auto px-4 py-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <aside class="lg:col-span-4 lg:sticky lg:top-10">
          <div
            class="overflow-hidden rounded-[2.5rem] border border-blue-100 bg-white shadow-xl shadow-blue-100/30 transition-all"
          >
            <div class="relative h-32 bg-gradient-to-br from-blue-50 to-indigo-100">
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
                    class="absolute -inset-1 rounded-[2rem] bg-blue-200/30 blur transition group-hover:opacity-100"
                  ></div>
                  <img
                    :src="authStore.userInfo?.avatarUrl || defaultAvatar"
                    class="relative w-24 h-24 rounded-[1.8rem] border-4 border-white object-cover shadow-lg"
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
              <div class="flex items-end justify-between">
                <div>
                  <h3 class="text-2xl font-bold text-slate-800 tracking-tight leading-none">
                    {{ form.userName || '求知者' }}
                  </h3>
                  <div class="mt-3 flex items-center gap-2">
                    <span
                      :class="[
                        'inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase',
                        form.role === 'teacher'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700',
                      ]"
                    >
                      {{ form.role === 'teacher' ? '认证讲师' : '正式学生' }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="my-8 border-t border-dashed border-slate-100"></div>

              <div class="space-y-6">
                <div class="flex items-center gap-4 group">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50/50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white"
                  >
                    <PhEnvelopeSimple size="20" weight="duotone" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      电子邮箱
                    </p>
                    <p class="truncate text-sm font-semibold text-slate-600 mt-0.5">
                      {{ form.email || '-' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-4 group">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50/50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white"
                  >
                    <PhPhone size="20" weight="duotone" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      联系电话
                    </p>
                    <p class="text-sm font-semibold text-slate-600 mt-0.5">
                      {{ form.phoneNumber || '未绑定' }}
                    </p>
                  </div>
                </div>
                <div class="flex items-start gap-4 group">
                  <div
                    class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50/50 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white"
                  >
                    <PhNotebook size="20" weight="duotone" />
                  </div>
                  <div>
                    <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      个人简介
                    </p>
                    <p class="text-sm italic leading-relaxed text-slate-500 mt-1">
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
            class="inline-flex items-center p-1.5 bg-slate-200/40 rounded-2xl backdrop-blur-md mb-6"
          >
            <button
              v-for="tab in ['profile', 'security']"
              :key="tab"
              @click="activeTab = tab as any"
              :class="[
                'flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all duration-300',
                activeTab === tab
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700',
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
            class="bg-white rounded-[2rem] border border-slate-200 px-8 py-8 lg:px-10 shadow-sm"
          >
            <Transition name="fade-slide" mode="out-in">
              <div v-if="activeTab === 'profile'" key="profile-panel">
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <span class="w-1 h-5 bg-blue-500 rounded-full"></span>
                    学术档案管理
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
                      <span class="text-[10px] text-slate-300 ml-2 font-normal">锁定项</span></label
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
                      placeholder="简单介绍一下您的研究领域或学习目标..."
                    ></textarea>
                  </div>
                  <div
                    class="md:col-span-2 flex items-center justify-end pt-5 border-t border-slate-50 mt-2"
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
                  <h2 class="text-xl font-bold text-slate-800 flex items-center gap-3">
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
                  <div class="pt-5 border-t border-slate-50 mt-2">
                    <button
                      type="submit"
                      :disabled="saving || !isSecurityDirty"
                      class="btn-edu-primary bg-slate-800 shadow-none hover:bg-slate-900 py-2.5"
                    >
                      更新访问凭证
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
/**
 ** 核心逻辑层
 * 包含：Pinia 状态同步、表单响应式状态、快照比较（脏检查）、API 调用
 */
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import ResultModal from '@/components/ResultModal.vue'
import defaultAvatar from '@/assets/R.png'
import { updateUserInfoApi, updateSafeInfoApi } from '@/api/user/user.api'
import { validateSecurityForm } from '@/util/validateSecurityForm'
import { PhUserFocus, PhShieldCheck } from '@phosphor-icons/vue'

/* --- 状态初始化 --- */
const authStore = useAuthStore()
const activeTab = ref<'profile' | 'security'>('profile') // 当前激活的面板
const saving = ref(false) // 提交按钮加载状态

// 个人资料响应式对象
const form = reactive({ userName: '', email: '', phoneNumber: '', bio: '', role: '' })

// 安全设置响应式对象
const securityForm = reactive({
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

// 表单快照：用于检测用户是否修改过内容（脏检查），避免无效请求
const initialFormSnapshot = ref('')

/** * 生成当前表单内容的字符串快照
 */
const takeProfileSnapshot = () => {
  initialFormSnapshot.value = JSON.stringify({
    userName: form.userName,
    phoneNumber: form.phoneNumber,
    bio: form.bio,
  })
}

/** * 计算属性：检查基本资料是否被修改
 */
const isProfileDirty = computed(() => {
  return (
    JSON.stringify({ userName: form.userName, phoneNumber: form.phoneNumber, bio: form.bio }) !==
    initialFormSnapshot.value
  )
})

/** * 计算属性：简单检查安全表单是否已填写
 */
const isSecurityDirty = computed(() => !!securityForm.currentPassword && !!securityForm.newPassword)

// 结果模态框状态管理
const resultModal = reactive({
  visible: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: '',
})
const showResultModal = (type: 'success' | 'error', title: string, message: string) => {
  Object.assign(resultModal, { visible: true, type, title, message })
}

/* --- 数据同步逻辑 --- */

/**
 * 从 AuthStore 同步数据到本地编辑表单
 */
const syncFromUserInfo = () => {
  if (!authStore.userInfo) return
  Object.assign(form, authStore.userInfo)
  securityForm.email = authStore.userInfo.email
  takeProfileSnapshot() // 初始化快照
}

onMounted(syncFromUserInfo)
watch(() => authStore.userInfo, syncFromUserInfo) // 监听全局用户信息变化，实时同步

/* --- 业务操作逻辑 --- */

/**
 * 提交基本资料更新
 */
const updateProfile = async () => {
  if (!isProfileDirty.value) return
  saving.value = true
  try {
    const res = await updateUserInfoApi({
      userName: form.userName,
      phoneNumber: form.phoneNumber,
      bio: form.bio,
    })
    authStore.setUserInfo(res) // 更新 Pinia
    takeProfileSnapshot() // 更新快照，使按钮恢复禁用状态
    showResultModal('success', '同步成功', '您的基本资料已成功更新。')
  } catch (e: any) {
    showResultModal('error', '操作失败', e?.message || '请检查您的网络连接。')
  } finally {
    saving.value = false
  }
}

/**
 * 提交安全设置更新 (密码更新)
 */
const updateSecuritySettings = async () => {
  if (!isSecurityDirty.value) return
  const validation = validateSecurityForm(securityForm, authStore.userInfo?.email)
  if (!validation.isValid) {
    showResultModal('error', '校验未通过', validation.errorMessage || '请修正表单错误')
    return
  }
  saving.value = true
  try {
    const res = await updateSafeInfoApi(validation.payload!)
    authStore.setUserInfo(res)
    // 重置密码输入框
    Object.assign(securityForm, { currentPassword: '', newPassword: '', confirmNewPassword: '' })
    showResultModal('success', '安全加固成功', '您的密码已更新，请妥善保管。')
  } catch (e: any) {
    showResultModal('error', '更新失败', e?.message || '请确认原始密码正确。')
  } finally {
    saving.value = false
  }
}

/**
 * * 头像上传（示例占位）
 */
const changeAvatar = () => {
  showResultModal('error', '暂未开放', '头像上传模块正在进行合规性审查。')
}
</script>

<style scoped>
/** 
  * 样式封装层：使用 Tailwind @apply 保持代码整洁
 */

/* 标签样式：使用 bold 和淡色 slate */
.form-label-edu {
  @apply block text-[13px] font-bold tracking-wide text-slate-500 ml-0.5;
}

/* 标准输入框：py-2 配合 14px 字体，实现更紧致的视觉高度，对齐左侧卡片 */
.form-input-edu {
  @apply w-full rounded-xl border-2 border-slate-100 bg-slate-50/30 px-4 py-2
         text-[14px] text-slate-700 outline-none transition-all duration-300
         placeholder:text-slate-300
         focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100/10;
}

/* 只读输入框：浅灰色背景，禁用鼠标手势 */
.form-input-edu-readonly {
  @apply w-full rounded-xl border-2 border-slate-100 bg-slate-100/50 px-4 py-2
         text-[14px] text-slate-400 cursor-not-allowed outline-none;
}

/* 主提交按钮：包含 hover 浮动动画 */
.btn-edu-primary {
  @apply flex items-center justify-center px-8 rounded-xl bg-blue-500 text-white font-bold text-sm
         shadow-lg shadow-blue-100 transition-all duration-300 hover:bg-blue-600 
         hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-40 disabled:pointer-events-none;
}

/* Transition 动画样式 */
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

/* 增强按钮点击反馈 */
.btn-edu-primary:active {
  transform: scale(0.96);
}
</style>
