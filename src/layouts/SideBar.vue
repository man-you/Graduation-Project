<template>
  <aside
    class="fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200 flex flex-col transition-transform duration-300 ease-out shadow-xl"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo & 用户操作 -->
    <div
      class="h-16 flex items-center px-6 gap-3 border-b border-slate-700 transition-opacity duration-200"
      :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div
        class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md"
      >
        <PhGraph :size="20" />
      </div>

      <span class="text-lg font-semibold text-white tracking-wide">知链</span>

      <!-- 用户菜单 -->
      <div class="ml-auto relative" v-if="user" ref="dropdownRef">
        <PhUserCircle
          :size="30"
          class="text-slate-300 hover:text-white transition-colors cursor-pointer"
          @click.stop="toggleDropdown"
        />

        <div
          v-if="showDropdown"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
        >
          <div class="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div class="font-medium text-gray-900">
              {{ user.userName }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ user.email }}
            </div>
          </div>

          <button
            @click="handleLogout"
            class="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 transition-colors flex items-center"
          >
            <PhSignOut class="mr-2" :size="16" />
            退出登录
          </button>
        </div>
      </div>
    </div>

    <!-- 用户信息 -->
    <div
      v-if="user"
      class="flex flex-col items-center py-6 border-b border-slate-700 transition-opacity duration-200 delay-75"
      :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div
        class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-3 shadow-md overflow-hidden"
      >
        <img
          :src="user.avatarUrl || defaultAvatar"
          :alt="user.userName"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="text-base font-medium text-white mt-2">
        {{ user.userName }}
      </div>
      <div class="text-sm text-slate-400">
        {{ user.email }}
      </div>
    </div>

    <!-- 菜单 -->
    <nav
      class="flex-1 px-3 py-4 space-y-1 text-sm transition-opacity duration-200 delay-100"
      :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div
        v-for="menu in filteredMenuList"
        @click="handleMenuClick(menu)"
        :key="menu.id"
        :class="[
          'flex items-center px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer group',
          $route.path === menu.path || (user?.role && $route.path === menu.pathMap?.[user.role])
            ? 'bg-blue-600/20 text-white shadow-inner border-l-4 border-blue-500 rounded-l-none'
            : 'hover:bg-slate-700/50 text-slate-300',
        ]"
      >
        <component
          :is="menu.icon"
          :size="22"
          :class="[
            'mr-3 transition-colors',
            $route.path === menu.path
              ? 'text-blue-400'
              : 'text-slate-400 group-hover:text-slate-200',
          ]"
        />
        <span class="font-medium text-[14px]">
          {{ menu.title }}
        </span>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { getFilteredMenuList } from '@/util/routerUtil'
import { useAuthStore } from '@/stores/auth.store'
import defaultAvatar from '@/assets/R.png'
import type { MenuItem } from '@/api/mock/menu'
import { useRouter } from 'vue-router'

defineProps<{
  open: boolean
}>()

const authStore = useAuthStore()
const router = useRouter()

// 用户信息
const user = computed(() => authStore.userInfo)

// 根据用户角色过滤菜单
const filteredMenuList = computed(() => {
  const role = user.value?.role || null
  return getFilteredMenuList(role)
})

// 菜单点击
const handleMenuClick = (menu: MenuItem) => {
  const role = user.value?.role
  if (!role) return

  // 优先使用 role 映射路径（兼容 ROLE_ROUTE_MAP）
  if (menu.pathMap?.[role]) {
    router.push(menu.pathMap[role])
  } else if (menu.path) {
    router.push(menu.path)
  }
}

// 下拉菜单状态
const showDropdown = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
  showDropdown.value = false
}

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(target)) {
    closeDropdown()
  }
}

// 注销
const handleLogout = async () => {
  if (confirm('确定要注销吗？')) {
    authStore.logout()
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
