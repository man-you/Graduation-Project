<template>
  <aside
    class="fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-slate-200 flex flex-col transition-transform duration-300 ease-out shadow-xl"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo -->
    <div
      class="h-16 flex items-center px-6 gap-3 border-b border-slate-700 transition-opacity duration-200"
      :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div
        class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md"
      >
        <PhGraph class="text-white" :size="20" />
      </div>
      <span class="text-lg font-semibold text-white tracking-wide">知链</span>
      <div class="ml-auto">
        <PhUserCircle :size="30" class="text-slate-300 hover:text-white transition-colors" />
      </div>
    </div>

    <!-- 用户信息 -->
    <div
      class="flex flex-col items-center py-6 border-b border-slate-700 transition-opacity duration-200 delay-75"
      :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div
        class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 mb-3 shadow-md"
      />
      <div class="text-base font-medium text-white mt-2">用户名</div>
      <div class="text-sm text-slate-400">student@edu.com</div>
    </div>

    <!-- 菜单 -->
    <nav
      class="flex-1 px-3 py-4 space-y-1 text-sm transition-opacity duration-200 delay-100"
      :class="open ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div
        v-for="menu of menuList"
        :key="menu.id"
        class="flex items-center px-4 py-3 rounded-lg hover:bg-slate-700/50 transition-colors cursor-pointer"
      >
        <component :is="menu.icon" :size="22" :weight="menu.weight" class="mr-3 text-slate-300" />
        <span class="text-slate-200 font-medium">{{ menu.title }}</span>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// 导入侧边栏数据
import { menuList } from '@/api/mock/menu'

defineProps<{
  open: boolean
}>()
</script>
