<template>
  <div
    class="p-8 text-slate-800 dark:text-slate-200 font-sans min-h-screen bg-slate-50/50 dark:bg-slate-950/50"
  >
    <div class="max-w-5xl mx-auto">
      <div class="mb-12 border-l-4 border-blue-600 pl-6">
        <h1 class="text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight uppercase">
          知链教育管理后台
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mt-2 font-medium">
          欢迎回来，系统管理员。请选择您需要操作的功能维度。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          class="group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
          @click="$router.push('/admin/users')"
        >
          <div class="relative z-10">
            <div
              class="w-14 h-14 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
            >
              <PhUsers :size="30" class="text-blue-600 dark:text-blue-400" weight="duotone" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">用户管理</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              全量学生与教师档案维护，支持权限分配、状态冻结及账号审计。
            </p>
          </div>
          <div
            class="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"
          ></div>
        </div>

        <div
          class="group relative bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 cursor-pointer overflow-hidden"
          @click="$router.push('/admin/settings')"
        >
          <div class="relative z-10">
            <div
              class="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-90 transition-transform duration-500"
            >
              <PhGear :size="30" class="text-emerald-600 dark:text-emerald-400" weight="duotone" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">系统配置</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              平台基础参数调优、安全策略加固、登录拦截设置及日志清理。
            </p>
          </div>
          <div
            class="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-50 dark:bg-emerald-900/10 rounded-full blur-2xl group-hover:bg-emerald-100 transition-colors"
          ></div>
        </div>

        <div
          class="relative bg-slate-100/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-8 transition-all overflow-hidden"
        >
          <div
            class="absolute top-4 right-4 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-black uppercase tracking-tighter rounded-full border border-amber-200 dark:border-amber-800/50"
          >
            Coming Soon
          </div>

          <div class="opacity-50">
            <div
              class="w-14 h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-6 grayscale"
            >
              <PhBookOpen :size="30" class="text-slate-500" weight="duotone" />
            </div>
            <h3 class="text-xl font-bold text-slate-400 dark:text-slate-600 mb-2">课程资源管理</h3>
            <p class="text-slate-400 dark:text-slate-600 text-sm leading-relaxed">
              教学课件库、多媒体资源分发及课程大纲的自动化管理模块。
            </p>
          </div>

          <div class="mt-6 flex gap-1">
            <div class="h-1 w-12 bg-blue-500/20 rounded-full overflow-hidden">
              <div class="h-full bg-blue-500 animate-[loading_2s_infinite] w-1/2"></div>
            </div>
            <div class="h-1 w-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div class="h-1 w-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </div>

      <div
        class="mt-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span class="text-sm text-slate-500 font-medium">系统当前版本: v1.0.0</span>
        </div>
        <div class="flex gap-4">
          <button class="text-xs text-slate-400 hover:text-blue-500 transition-colors">
            操作文档
          </button>
          <button class="text-xs text-slate-400 hover:text-blue-500 transition-colors">
            联系技术支持
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PhUsers, PhGear } from '@phosphor-icons/vue'
</script>
