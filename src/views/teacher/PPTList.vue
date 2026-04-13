<template>
  <div
    class="flex-1 min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-700"
  >
    <!-- 背景装饰：极淡的网格线 -->
    <div
      class="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
      style="
        background-image: radial-gradient(#2563eb 0.5px, transparent 0.5px);
        background-size: 24px 24px;
      "
    ></div>

    <!-- 顶部标题区域 -->
    <header
      class="relative z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-8 py-16"
    >
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-4">
            <div
              class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-wider uppercase"
            >
              <PhSparkle :size="14" weight="fill" />
              AI驱动库
            </div>
            <h1 class="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
              PPT
              <span
                class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500"
                >模板库</span
              >
            </h1>
            <p class="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
              精选专业教育模板，支持 星火大模型 智能驱动的内容填充，让备课效率提升 10 倍。
            </p>
          </div>
        </div>
      </div>
    </header>

    <main class="relative z-10 max-w-7xl mx-auto px-8 py-12 w-full flex-1">
      <transition name="page-fade" mode="out-in">
        <!-- 加载状态 -->
        <div
          v-if="pptStore.loading"
          key="loading"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for="i in 6"
            :key="i"
            class="bg-white rounded-3xl border border-slate-100 p-4 space-y-4 shadow-sm"
          >
            <div class="aspect-video bg-slate-100 animate-pulse rounded-2xl"></div>
            <div class="px-2 pb-2 space-y-3">
              <div class="h-5 bg-slate-100 rounded-md w-2/3 animate-pulse"></div>
              <div class="h-4 bg-slate-50 rounded-md w-1/3 animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- 模板列表 -->
        <div v-else key="content" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="template in pptStore.templates"
            :key="template.templateIndexId"
            class="group bg-white rounded-[2rem] border border-slate-200/80 p-3 flex flex-col relative hover:border-blue-500/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.07)] transition-all duration-500"
          >
            <!-- 封面图容器 -->
            <div class="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden bg-slate-100">
              <img
                :src="pptStore.getTemplateImage(template)"
                alt="模板预览"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              <!-- 悬浮动作层 -->
              <div
                class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-[3px]"
              >
                <button
                  @click.stop="handleSelectTemplate(template)"
                  class="bg-white text-slate-900 px-7 py-3 rounded-xl text-sm font-black shadow-2xl hover:bg-blue-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 active:scale-95"
                >
                  立即创作
                </button>
              </div>

              <!-- 左上角颜色徽章 -->
              <div class="absolute top-3 left-3">
                <span
                  class="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md border border-white/20 text-[10px] font-black text-slate-800 shadow-sm uppercase tracking-tighter"
                >
                  {{ template.color }}
                </span>
              </div>
            </div>

            <!-- 底部内容 -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div class="flex items-start justify-between gap-2 mb-2">
                  <h3
                    class="text-lg font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors"
                  >
                    {{ template.industry }}
                  </h3>
                  <PhArrowUpRight
                    :size="18"
                    class="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <div class="flex items-center gap-1.5">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    {{ template.style }}
                  </span>
                </div>
                <!-- 模拟幻灯片张数或热度 -->
                <div class="flex items-center gap-1 text-slate-300">
                  <PhSlideshow :size="14" />
                  <span class="text-[10px] font-medium">12页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </main>

    <!-- 底部备案/页脚（可选） -->
    <footer class="mt-auto py-10 px-8 border-t border-slate-200 bg-white">
      <div
        class="max-w-7xl mx-auto flex items-center justify-between text-slate-400 text-xs font-medium"
      >
        <p>© 2026 知链 AI 智能教育平台</p>
        <div class="flex gap-6">
          <a href="#" class="hover:text-slate-600 transition-colors">隐私政策</a>
          <a href="#" class="hover:text-slate-600 transition-colors">服务协议</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePPTStore } from '@/stores/ppt.store'
import type { PPTTemplate } from '@/types/ppt.type'

const pptStore = usePPTStore()
const router = useRouter()

const handleSelectTemplate = (template: PPTTemplate) => {
  router.push({
    name: 'PPT',
    params: { templateId: template.templateIndexId },
  })
}

onMounted(() => {
  pptStore.loadTemplates()
})
</script>

<style scoped>
/* 页面切换动画 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
