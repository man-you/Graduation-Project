<template>
  <div class="h-screen flex bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
    <Sidebar
      v-if="authStore.userInfo"
      :open="sidebarOpen"
      class="fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out border-r border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 shadow-sm"
      :class="sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'"
    />

    <main
      class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out bg-slate-50 dark:bg-slate-950"
      :style="{ marginLeft: sidebarOpen ? '256px' : '0px' }"
    >
      <PageHeader @toggle-sidebar="toggleSidebar" />

      <div class="flex-1 overflow-auto p-6">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <div
              :key="$route.fullPath"
              class="bg-white dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-2xl min-h-full overflow-hidden"
            >
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/layouts/SideBar.vue'
import PageHeader from '@/layouts/PageHeader.vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

// 默认开启
const sidebarOpen = ref(true)

// 切换函数：确保这个函数被调用
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<style scoped>
/* 页面切换动画：轻微上浮 + 透明度变化 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
