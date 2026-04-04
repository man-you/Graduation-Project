<template>
  <div
    class="min-h-screen bg-[#F8FAFC] font-sans antialiased text-slate-800 pb-24 relative overflow-hidden"
  >
    <!-- 柔和的背景装饰 -->
    <div
      class="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none"
    ></div>
    <div
      class="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[100px] pointer-events-none"
    ></div>

    <!-- 导航栏 -->
    <header
      class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-8 py-5"
    >
      <div class="max-w-5xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-5">
          <button
            @click="router.back()"
            class="group flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 shadow-sm"
          >
            <PhArrowLeft :size="18" weight="bold" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-blue-600 tracking-tight">AI智能教学课件 生成</h1>
            <p class="text-xs text-slate-400 font-medium tracking-wide">
              专业、高效、富有启发性的演示文稿辅助工具
            </p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-8 mt-12 relative z-10">
      <transition name="fade-subtle" mode="out-in">
        <!-- 状态1：配置页 -->
        <div v-if="!pptStore.pptUrl && !pptStore.generating" key="form" class="space-y-8">
          <div
            class="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden"
          >
            <div class="p-8 md:p-10 space-y-8">
              <!-- 主题输入区 -->
              <div class="space-y-4">
                <label
                  class="flex items-center gap-3 text-sm font-bold text-blue-600 uppercase tracking-wider"
                >
                  <div class="p-1.5 bg-blue-600 rounded-md shadow-md shadow-blue-100">
                    <PhMagicWand :size="16" weight="fill" class="text-white" />
                  </div>
                  课程主题与内容纲要
                </label>

                <div class="relative">
                  <textarea
                    v-model="prompt"
                    placeholder="例如：数据结构与算法课程《线性表与链表》教学大纲，包含数组实现、链表操作、时间复杂度分析及典型应用案例..."
                    class="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 leading-relaxed min-h-[180px] resize-none text-base"
                  ></textarea>
                </div>
              </div>

              <!-- 配置网格 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-3">
                  <label class="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                    <PhUserCircle :size="18" class="text-blue-500" />
                    主讲人
                  </label>
                  <input
                    v-model="author"
                    type="text"
                    placeholder="请输入您的姓名"
                    class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium text-base"
                  />
                </div>

                <div class="space-y-3">
                  <label class="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                    <PhSelectionAll :size="18" class="text-blue-500" />
                    辅助功能选项
                  </label>
                  <div
                    class="flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/50 transition-all"
                    @click="isFigure = !isFigure"
                  >
                    <span
                      class="text-sm font-medium"
                      :class="isFigure ? 'text-blue-600' : 'text-slate-600'"
                      >根据内容自动配图</span
                    >
                    <div
                      class="w-11 h-6 rounded-full transition-colors relative"
                      :class="isFigure ? 'bg-blue-600' : 'bg-slate-300'"
                    >
                      <div
                        class="absolute top-1.5 left-1.5 bg-white w-3 h-3 rounded-full transition-transform"
                        :class="isFigure ? 'translate-x-5' : ''"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部操作栏 -->
            <div
              class="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6"
            >
              <div class="flex-1 text-left">
                <div class="space-y-2">
                  <p class="text-xs text-slate-500 font-medium leading-relaxed">
                    <span class="font-bold text-slate-600">注意：</span>
                    AI生成内容仅供教学参考，请下载后进行二次校对
                  </p>
                  <p class="text-xs text-slate-500 font-medium leading-relaxed">
                    生成的PPT不会保存到云端，请及时下载保存
                  </p>
                </div>
              </div>

              <button
                @click="handleGeneratePPT"
                :disabled="!prompt.trim() || pptStore.generating"
                class="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-bold text-base shadow-md hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 transition-all active:scale-95 w-full md:w-auto justify-center min-w-[200px]"
              >
                <PhLightning :size="20" weight="fill" class="text-blue-200" />
                <span>开始智能创作</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 状态2：生成中 -->
        <div
          v-else-if="pptStore.generating"
          key="progress"
          class="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-xl shadow-slate-200/50"
        >
          <div class="max-w-md mx-auto space-y-10">
            <div class="space-y-4">
              <div class="flex justify-between items-end mb-3">
                <h3 class="text-xl font-bold text-blue-600">{{ progressStatusText }}</h3>
                <span class="text-3xl font-bold text-blue-600 tabular-nums">
                  {{ Math.round(pptStore.progress) }}<span class="text-lg ml-1">%</span>
                </span>
              </div>
              <div class="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 transition-all duration-500 ease-out"
                  :style="{ width: `${pptStore.progress}%` }"
                ></div>
              </div>
            </div>

            <transition name="slide-up" mode="out-in">
              <p
                :key="progressStatusText"
                class="text-slate-500 text-base font-medium tracking-wide"
              >
                {{ progressStatusText }}
              </p>
            </transition>

            <button
              @click="pptStore.resetGeneration()"
              class="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
            >
              取消生成
            </button>
          </div>
        </div>

        <!-- 状态3：成功页 -->
        <div v-else-if="pptStore.pptUrl" key="success">
          <div
            class="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 text-center shadow-lg shadow-slate-200/40 max-w-xl mx-auto"
          >
            <!-- 课件预览图 -->
            <div
              class="w-full aspect-video bg-slate-100 rounded-lg mb-3 overflow-hidden relative border border-slate-200 flex items-center justify-center"
            >
              <div class="text-blue-400">
                <PhPresentationChart :size="32" weight="fill" />
              </div>
              <div
                class="absolute top-1.5 right-1.5 bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs font-bold shadow-sm"
              >
                生成完毕
              </div>
            </div>

            <div class="space-y-1.5 mb-3">
              <h2 class="text-base font-bold text-slate-900">
                课件制作 <span class="text-blue-600">完成</span>
              </h2>
              <p class="text-slate-400 text-sm font-medium">
                已根据您的教学主题构建了完整的课程逻辑与视觉排版
              </p>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-1.5">
              <a
                :href="pptStore.pptUrl ?? undefined"
                download
                class="flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-md font-bold text-sm shadow-sm shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 w-full sm:w-auto"
              >
                <PhDownloadSimple :size="14" weight="bold" />
                下载课件文件 (PPTX)
              </a>
              <button
                @click="handleRegenerate"
                class="flex items-center justify-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-md font-bold text-sm hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95 w-full sm:w-auto border border-slate-200"
              >
                <PhArrowClockwise :size="14" weight="bold" />
                重新制作
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- 错误反馈 -->
      <div
        v-if="pptStore.generationError"
        class="mt-8 flex items-start gap-5 p-7 bg-red-50 border border-red-100 rounded-xl"
      >
        <PhWarningCircle :size="28" weight="fill" class="text-red-500 mt-1" />
        <div class="flex-1">
          <p class="text-red-900 font-bold text-lg">生成遇到问题</p>
          <p class="text-red-600/80 text-base font-medium mb-5">{{ pptStore.generationError }}</p>
          <button
            @click="handleRetry"
            class="text-red-600 text-base font-bold underline decoration-2 underline-offset-4"
          >
            重试一次
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePPTStore } from '@/stores/ppt.store'

const route = useRoute()
const router = useRouter()
const pptStore = usePPTStore()

const templateId = route.params.templateId as string
const prompt = ref('')
const author = ref('')
const isFigure = ref(true)

const progressStatusText = computed(() => {
  const p = pptStore.progress
  if (p < 15) return '正在分析教学关键词...'
  if (p < 30) return '正在构建课程逻辑架构...'
  if (p < 45) return '正在匹配教学演示色调...'
  if (p < 60) return '正在检索/生成教学配图...'
  if (p < 80) return '正在渲染幻灯片排版...'
  if (p < 95) return '正在优化文字可读性...'
  return '正在准备导出文件...'
})

const handleGeneratePPT = async () => {
  if (!prompt.value.trim()) return

  await pptStore.createPPT({
    prompt: prompt.value.trim(),
    templateId,
    author: author.value.trim() || undefined,
    isFigure: isFigure.value,
  })
}

const handleRegenerate = () => {
  pptStore.resetGeneration()
  prompt.value = ''
  author.value = ''
}

const handleRetry = () => {
  pptStore.generationError = null
  // 重试时继续使用已有的 SID 进行进度查询
  if (pptStore.currentSid) {
    pptStore.pollPPTProgress()
  }
}

/**
 * 监听浏览器标签页可见性变化
 * 解决浏览器切后台导致 setTimeout 假死/丢轮询的问题
 */
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    // 如果回到页面时，任务处于进行中且没有正在计时的定时器，立即拉起一次轮询
    if (pptStore.currentSid && !pptStore.pptUrl && !pptStore.pollingTimer) {
      console.debug('检测到页面恢复可见，唤醒轮询...')
      pptStore.pollPPTProgress()
    }
  }
}

onMounted(() => {
  // 1. 检查是否有持久化的任务需要恢复
  if (pptStore.currentSid && !pptStore.pptUrl) {
    console.debug('检测到未完成的任务 SID，自动恢复轮询...')
    pptStore.generating = true // 确保 UI 切换到生成中状态
    pptStore.pollPPTProgress()
  } else if (!pptStore.currentSid) {
    // 只有在确定没有未完成任务时，才清理状态
    pptStore.resetGeneration()
  }

  // 2. 注册防休眠唤醒事件
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  // 清理事件监听
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  // 组件销毁时停止轮询，但保留 localStorage 中的 SID 以便后续恢复
  pptStore.cleanupOnUnmount()
})
</script>

<style scoped>
/* 页面切换动效 */
.fade-subtle-enter-active,
.fade-subtle-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}
.fade-subtle-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-subtle-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 文本平滑切换动效 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
