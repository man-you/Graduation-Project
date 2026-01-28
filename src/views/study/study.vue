<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-900 overflow-hidden">
    <!-- 侧边栏组件 -->
    <Sidebar v-if="authStore.userInfo" :open="sidebarOpen" />

    <!-- 主内容区域Main -->
    <main
      class="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-all duration-300 ease-out"
      :class="sidebarOpen ? 'ml-64' : 'ml-0'"
    >
      <!-- 顶部栏组件 -->
      <PageHeader @toggle-sidebar="toggleSidebar" />

      <!-- 内容区 -->
      <div class="flex-1 bg-slate-50 dark:bg-slate-900 overflow-hidden relative">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <div
              :key="$route.fullPath"
              class="h-full rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
            >
              <component :is="Component" />
            </div>
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/layouts/SideBar.vue'
import PageHeader from '@/layouts/PageHeader.vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const sidebarOpen = ref(true)

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
