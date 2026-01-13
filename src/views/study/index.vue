<template>
  <div class="min-h-screen flex bg-slate-50 dark:bg-slate-900 overflow-hidden">
    <!-- 侧边栏组件 -->
    <Sidebar :open="sidebarOpen" />

    <!-- 主内容区域Main -->
    <main
      class="flex-1 flex flex-col bg-white dark:bg-slate-900 transition-all duration-300 ease-out"
      :class="sidebarOpen ? 'ml-64' : 'ml-0'"
    >
      <!-- 顶部栏组件 -->
      <PageHeader @toggle-sidebar="toggleSidebar" />

      <!-- 内容区 -->
      <div class="flex-1 bg-slate-50 dark:bg-slate-900">
        <div
          class="h-full rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6"
        >
          <router-view />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/layouts/SideBar.vue'
import PageHeader from '@/layouts/PageHeader.vue'

const sidebarOpen = ref(true)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}
</script>
