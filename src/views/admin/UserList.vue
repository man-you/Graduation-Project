<template>
  <div class="p-6 text-slate-800 dark:text-slate-200 font-sans">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
      <div>
        <h1
          class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
        >
          用户管理
        </h1>
        <p class="text-slate-500 text-sm mt-2">管理系统内的所有学生、教师账户。</p>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <div class="relative w-full sm:w-72">
          <span class="absolute inset-y-0 left-3 flex items-center text-slate-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            type="text"
            placeholder="搜索用户邮箱或姓名"
            class="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200"
          />
        </div>

        <button
          @click="openAddUserModal"
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm rounded-lg font-medium transition-all duration-200 shadow-sm"
        >
          <PhPlus :size="18" weight="bold" />
          添加用户
        </button>
      </div>
    </div>

    <div v-if="adminStore.loading" class="flex justify-center items-center py-20">
      <div
        class="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <span class="ml-4 text-slate-500 text-base">数据加载中...</span>
    </div>

    <div v-else>
      <div v-if="adminStore.users.length > 0">
        <div
          class="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm min-w-full border-collapse">
              <thead
                class="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 sticky top-0"
              >
                <tr>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">学号</th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">用户名</th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">姓名</th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">邮箱</th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">角色</th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200">年级</th>
                  <th class="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 w-32">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                <tr
                  v-for="user in adminStore.users"
                  :key="user.identifier"
                  class="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors duration-150"
                >
                  <td class="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {{ user.identifier }}
                  </td>
                  <td class="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                    {{ user.userName || '-' }}
                  </td>
                  <td class="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">
                    {{ user.realName || '-' }}
                  </td>
                  <td class="px-6 py-4 text-slate-500 dark:text-slate-400">{{ user.email }}</td>
                  <td class="px-6 py-4">
                    <span
                      :class="[
                        'px-2.5 py-0.5 rounded text-xs font-medium border',
                        user.role === 'admin'
                          ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/40'
                          : user.role === 'teacher'
                            ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/40'
                            : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/40',
                      ]"
                    >
                      {{ getRoleText(user.role) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {{ user.grade || '-' }}
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-4">
                      <button
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors dark:text-blue-400"
                      >
                        编辑
                      </button>
                      <button
                        @click="confirmDeleteUser(user)"
                        class="text-red-500 hover:text-red-600 font-medium text-sm transition-colors dark:text-red-400"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between mt-6 gap-4 px-2">
          <div class="text-sm text-slate-500 dark:text-slate-400">
            共 <span class="font-medium">{{ adminStore.pagination.total }}</span> 条数据
          </div>
          <div class="flex items-center gap-2 text-sm">
            <button
              :disabled="adminStore.pagination.pageNum === 1"
              @click="changePage(adminStore.pagination.pageNum - 1)"
              class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-300 font-medium"
            >
              上一页
            </button>
            <span
              class="px-4 py-2 bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-bold shadow-sm"
            >
              {{ adminStore.pagination.pageNum }}
            </span>
            <button
              :disabled="
                adminStore.pagination.pageNum * adminStore.pagination.pageSize >=
                adminStore.pagination.total
              "
              @click="changePage(adminStore.pagination.pageNum + 1)"
              class="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600 dark:text-slate-300 font-medium"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      <div
        v-else
        class="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-white/50 dark:bg-slate-800/30"
      >
        <PhUsers size="64" class="mx-auto text-slate-300 mb-6" weight="light" />
        <h3 class="text-xl font-bold text-slate-600 dark:text-slate-300 mb-2">暂无用户数据</h3>
        <p class="text-slate-400 dark:text-slate-500 text-base">您可以点击上方按钮添加新用户</p>
      </div>
    </div>

    <div
      v-if="showAddUserModal || editingUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50"
        >
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
            {{ editingUser ? '编辑用户信息' : '新增用户账号' }}
          </h3>
          <button
            @click="closeModal"
            class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-all"
          >
            <PhX size="20" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2 sm:col-span-1">
              <label
                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >用户名</label
              >
              <input
                v-model="formData.userName"
                type="text"
                placeholder="用户昵称"
                class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-all"
              />
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label
                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
              >
                登录邮箱 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                placeholder="example@mail.com"
                :disabled="!!editingUser"
                class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:bg-slate-50 dark:disabled:bg-slate-800 disabled:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
            >
              访问密码 <span v-if="!editingUser" class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.password"
              type="password"
              :placeholder="editingUser ? '如果不修改请留空' : '请输入登录密码'"
              class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-all"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >联系电话</label
              >
              <input
                v-model="formData.phoneNumber"
                type="text"
                placeholder="手机号"
                class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-all"
              />
            </div>
            <div>
              <label
                class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5"
                >所属年级</label
              >
              <input
                v-model="formData.grade"
                type="text"
                placeholder="如：大一"
                class="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3"
              >权限角色分配</label
            >
            <div
              class="flex gap-6 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700"
            >
              <label
                v-for="role in ['student', 'teacher']"
                :key="role"
                class="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="radio"
                  v-model="formData.role"
                  :value="role"
                  class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                />
                <span
                  class="text-sm text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors"
                  >{{ getRoleText(role) }}</span
                >
              </label>
            </div>
          </div>

          <p v-if="errorMessage" class="text-xs text-red-500 flex items-center gap-1.5">
            <PhX circle weight="fill" /> {{ errorMessage }}
          </p>

          <div class="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-all shadow-sm shadow-blue-500/20"
            >
              {{ loading ? '同步中...' : '保存更改' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]"
    >
      <div
        class="w-full max-w-sm bg-white dark:bg-slate-800 rounded-xl shadow-xl p-6 border border-slate-200 dark:border-slate-700"
      >
        <div class="flex items-center gap-4 mb-4">
          <div
            class="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center shrink-0"
          >
            <PhTrash size="20" class="text-red-600 dark:text-red-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">确认删除用户？</h3>
        </div>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          此操作不可撤销。用户
          <span class="font-semibold text-slate-700 dark:text-slate-200">{{
            deletingUser?.email
          }}</span>
          的所有数据将被移除。
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteConfirm = false"
            class="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            返回
          </button>
          <button
            @click="deleteUser"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold disabled:opacity-50 transition-all"
          >
            {{ deleting ? '删除中...' : '确认注销' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin.store'
import { PhUsers, PhPlus, PhX, PhTrash } from '@phosphor-icons/vue'

const adminStore = useAdminStore()
const searchQuery = ref('')
let debouncedSearch: any = null

const showAddUserModal = ref(false)
const editingUser = ref<any>(null)
const showDeleteConfirm = ref(false)
const deletingUser = ref<any>(null)

const formData = ref({
  userName: '',
  email: '',
  password: '',
  phoneNumber: '',
  grade: '',
  role: 'student' as 'student' | 'teacher',
})

const loading = ref(false)
const deleting = ref(false)
const errorMessage = ref('')

const getRoleText = (role: string) => {
  const roleMap: Record<string, string> = {
    student: '学生',
    teacher: '教师',
  }
  return roleMap[role] || role
}

const handleSearch = () => {
  if (debouncedSearch) clearTimeout(debouncedSearch)
  debouncedSearch = setTimeout(() => {
    adminStore.searchUsers(searchQuery.value)
  }, 300)
}

const changePage = (pageNum: number) => {
  adminStore.getUserList(pageNum)
}

const openAddUserModal = () => {
  formData.value = {
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
    grade: '',
    role: 'student',
  }
  errorMessage.value = ''
  editingUser.value = null
  showAddUserModal.value = true
}

const editUser = (user: any) => {
  editingUser.value = user
  formData.value = {
    userName: user.userName || '',
    email: user.email,
    password: '',
    phoneNumber: user.phoneNumber || '',
    grade: user.grade || '',
    role: user.role,
  }
  errorMessage.value = ''
  showAddUserModal.value = true
}

const closeModal = () => {
  showAddUserModal.value = false
  editingUser.value = null
}

const handleSubmit = async () => {
  errorMessage.value = ''
  if (!formData.value.email || (!editingUser.value && !formData.value.password)) {
    errorMessage.value = '请填写必填项（邮箱和密码）'
    return
  }

  try {
    loading.value = true
    const payload: any = { ...formData.value }
    Object.keys(payload).forEach((key) => {
      if (payload[key] === '' || payload[key] === undefined) {
        delete payload[key]
      }
    })

    if (editingUser.value) {
      await adminStore.updateUser(editingUser.value.id, payload)
    } else {
      payload.identifier = payload.email
      await adminStore.createUser(payload)
    }
    closeModal()
  } catch (error: any) {
    errorMessage.value = error.message || '操作失败，请重试'
  } finally {
    loading.value = false
  }
}

const confirmDeleteUser = (user: any) => {
  deletingUser.value = user
  showDeleteConfirm.value = true
}

const deleteUser = async () => {
  if (!deletingUser.value) return
  try {
    deleting.value = true
    await adminStore.deleteUser(deletingUser.value.id)
    showDeleteConfirm.value = false
    deletingUser.value = null
  } catch (error: any) {
    console.error('删除失败:', error)
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  adminStore.getUserList()
})
</script>
