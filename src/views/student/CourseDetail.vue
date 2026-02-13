<template>
  <div class="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased">
    <aside
      class="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10"
    >
      <div
        class="p-6 border-b border-slate-100 flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20"
      >
        <button
          @click="goBack"
          class="group flex items-center justify-center w-10 h-10 -ml-2 mb-4 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-blue-600 hover:border-blue-100 transition-colors"
        >
          <PhArrowLeft :size="18" weight="bold" />
        </button>
        <h1
          class="text-xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4 cursor-pointer hover:text-blue-600 transition-colors group"
          @click="showCourseGraph"
        >
          {{ courseTitle }}
          <span
            class="inline-block ml-2 text-xs font-normal text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            点击查看知识图谱
          </span>
        </h1>

        <div class="flex items-center gap-2">
          <div
            class="flex items-center bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-[13px] font-bold"
          >
            <PhClock :size="13" class="mr-1.5" /> {{ totalDuration }}
          </div>
          <div
            class="flex items-center bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[13px] font-bold"
          >
            {{ flatNodes.length }} 章节
          </div>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        <div v-for="lvl2 in courseData[0]?.childNodes" :key="lvl2.id">
          <h2 class="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-3">
            {{ lvl2.nodeName }}
          </h2>

          <div v-for="lvl3 in lvl2.childNodes" :key="lvl3.id" class="mb-1">
            <div
              @click="toggleExpand(lvl3.id)"
              :class="[
                'flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all group',
                expandedNodes.includes(lvl3.id) ? 'bg-slate-50' : 'hover:bg-slate-50/50',
              ]"
            >
              <div class="flex items-center min-w-0">
                <PhCaretRight
                  :size="12"
                  weight="bold"
                  :class="[
                    'mr-3 transition-transform text-slate-300',
                    { 'rotate-90 text-blue-600': expandedNodes.includes(lvl3.id) },
                  ]"
                />
                <span
                  class="text-[15px] font-bold text-slate-700 truncate group-hover:text-slate-900"
                >
                  {{ lvl3.nodeName }}
                </span>
              </div>
            </div>

            <transition name="list">
              <ul
                v-show="expandedNodes.includes(lvl3.id)"
                class="ml-[23px] mt-1 space-y-1 border-l-2 border-slate-100"
              >
                <li
                  v-for="lvl4 in lvl3.childNodes"
                  :key="lvl4.id"
                  @click="handleNodeClick(lvl4, lvl3.id)"
                  :class="[
                    'relative -ml-[2px] pl-6 py-3 pr-3 text-sm cursor-pointer transition-all border-l-2 flex items-center justify-between group rounded-r-xl',
                    currentNode?.id === lvl4.id
                      ? 'bg-blue-50 border-blue-600 text-blue-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/80',
                  ]"
                >
                  <div class="flex items-center overflow-hidden">
                    <div class="mr-3 flex-shrink-0">
                      <PhCheckCircle
                        v-if="lvl4.isCompleted"
                        :size="16"
                        weight="fill"
                        class="text-emerald-500"
                      />
                      <div
                        v-else
                        :class="[
                          'w-1.5 h-1.5 rounded-full',
                          currentNode?.id === lvl4.id
                            ? 'bg-blue-600'
                            : 'bg-slate-200 group-hover:bg-slate-400',
                        ]"
                      ></div>
                    </div>
                    <span class="truncate text-[14px] tracking-tight">{{ lvl4.nodeName }}</span>
                  </div>
                  <PhPlay
                    v-if="currentNode?.id !== lvl4.id"
                    :size="12"
                    weight="fill"
                    class="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity"
                  />
                </li>
              </ul>
            </transition>
          </div>
        </div>
      </nav>

      <div class="p-6 border-t border-slate-100 bg-white">
        <div class="flex justify-between items-end mb-3">
          <span class="text-[13px] font-black text-slate-400 uppercase tracking-widest"
            >学习进度</span
          >
          <span class="text-blue-600 text-[15px] font-black">{{ progressPercent }}%</span>
        </div>
        <div class="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            class="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
            :style="{ width: progressPercent + '%' }"
          ></div>
        </div>
      </div>
    </aside>

    <main class="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-50">
      <div
        v-if="currentNode"
        class="flex-1 overflow-y-auto p-5 lg:p-12 scroll-smooth"
        ref="contentScrollRef"
      >
        <div class="max-w-4xl mx-auto w-full space-y-8 pb-32">
          <!-- 视频播放展位区域 -->
          <div
            class="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden aspect-video relative group border border-slate-800 shadow-blue-900/10"
          >
            <img
              src="https://picsum.photos/seed/course/1280/720"
              class="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
            />
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div
                class="w-20 h-20 rounded-full bg-blue-600 shadow-xl shadow-blue-600/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform cursor-pointer"
              >
                <PhPlay :size="32" weight="fill" class="ml-1" />
              </div>
              <p class="text-sm font-bold tracking-widest text-blue-100">START LESSON</p>
            </div>
          </div>

          <div
            class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-14 relative"
          >
            <header class="mb-10">
              <div class="flex items-center gap-3 mb-6">
                <span
                  class="px-3 py-1 rounded-lg text-[12px] font-black uppercase tracking-[0.2em] bg-blue-600 text-white"
                >
                  章节 {{ currentStepIndex + 1 }}
                </span>
                <div class="h-px bg-slate-100 flex-1"></div>
              </div>
              <h2
                class="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight"
              >
                {{ currentNode.nodeName }}
              </h2>
            </header>

            <article class="prose prose-slate max-w-none">
              <div
                class="bg-slate-50 p-7 rounded-2xl border border-slate-100 mb-10 flex items-start"
              >
                <PhInfo :size="22" class="text-blue-500 mr-4 mt-1 flex-shrink-0" weight="fill" />
                <div class="text-[15px] text-slate-600 leading-relaxed m-0">
                  <strong class="text-slate-900 block mb-1">本节目标</strong>
                  {{ currentNode.description || '掌握核心概念并完成本小节的知识内化。' }}
                </div>
              </div>
            </article>

            <!-- 集中操作按钮区域 -->
            <div v-if="!showPdfViewer" class="flex justify-center gap-4 mt-8">
              <button
                @click="showPdfViewer = true"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <PhFilePdf :size="20" weight="fill" />
                课程讲义
              </button>
              <button
                @click="loadQuiz"
                class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <PhExam :size="20" weight="fill" />
                课后习题
              </button>
            </div>
          </div>

          <!-- PDFViewer 显示区域 -->
          <div
            v-if="showPdfViewer"
            class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-14 relative"
          >
            <button
              @click="showPdfViewer = false"
              class="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition-colors duration-200 z-10"
              title="关闭预览"
            >
              <PhX :size="20" weight="bold" />
            </button>
            <PDFViewer :node-id="currentNode.id" :key="currentNode.id" :show-preview="true" />
          </div>
        </div>
      </div>

      <div class="absolute bottom-10 left-0 right-0 z-20 px-6 pointer-events-none">
        <div
          class="max-w-lg mx-auto bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-2 shadow-2xl flex items-center justify-between border border-white/10 pointer-events-auto"
        >
          <button
            @click="goPrev"
            :disabled="isFirst"
            class="flex items-center text-[14px] font-bold text-slate-400 hover:text-white disabled:opacity-20 p-4 rounded-2xl transition-all"
          >
            <PhArrowFatLineLeft :size="18" class="mr-2" weight="fill" /> 上一节
          </button>
          <div class="flex flex-col items-center px-10 border-x border-white/10">
            <span class="text-[14px] font-black font-mono tracking-wider">
              {{ currentStepIndex + 1 }} / {{ flatNodes.length }}
            </span>
          </div>
          <button
            @click="goNext"
            :disabled="isLast"
            class="flex items-center text-[14px] font-bold text-slate-400 hover:text-white disabled:opacity-20 p-4 rounded-2xl transition-all"
          >
            下一节 <PhArrowFatLineRight :size="18" class="ml-2" weight="fill" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { routerBack } from '@/util/routerUtil'
import PDFViewer from '@/components/PDFViewer.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// --- Store 数据绑定 ---
const { CourseNodes: courseData, courseList } = storeToRefs(courseStore)

// --- 响应式状态 ---
const expandedNodes = ref([]) // 记录展开的 LEVEL3 节点 ID
const currentNode = ref(null) // 当前选中的 LEVEL4 节点
const contentScrollRef = ref(null)
const showPdfViewer = ref(false) // 控制 PDFViewer 的显示状态

// --- 计算属性 ---

// 获取当前课程的元数据
const currentCourseMeta = computed(() => {
  const id = Number(route.params.id)
  return courseList.value.find((c) => c.id === id) || {}
})

// 课程标题优先从 API 返回的树结构中取，否则取元数据
const courseTitle = computed(() => {
  return courseData.value?.[0]?.nodeName || currentCourseMeta.value.title || '课程详情'
})

// 计算格式化时长
const totalDuration = computed(() => {
  const seconds = currentCourseMeta.value.estimatedDuration || 0
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
})

//平铺所有可学习节点 (Level 4)，用于上一节/下一节导航
const flatNodes = computed(() => {
  const list = []
  courseData.value?.[0]?.childNodes?.forEach((l2) => {
    l2.childNodes?.forEach((l3) => {
      l3.childNodes?.forEach((l4) => {
        list.push({ ...l4, parentNodeId: l3.id })
      })
    })
  })
  return list
})

// 当前节点在列表中的索引
const currentStepIndex = computed(() => {
  return flatNodes.value.findIndex((n) => n.id === currentNode.value?.id)
})

// 计算学习进度百分比
const progressPercent = computed(() => {
  const total = flatNodes.value.length
  if (total === 0) return 0
  const completed = flatNodes.value.filter((n) => n.isCompleted).length
  return Math.round((completed / total) * 100)
})

const isFirst = computed(() => currentStepIndex.value <= 0)
const isLast = computed(() => currentStepIndex.value >= flatNodes.value.length - 1)

// --- 生命周期与逻辑处理 ---

onMounted(async () => {
  const courseId = Number(route.params.id)
  if (!courseId) return router.push('/course')

  try {
    await courseStore.getCourseNodes(courseId)

    // 默认行为：定位到第一个未完成章节，若都完成则选第一章
    if (flatNodes.value.length > 0) {
      const target = flatNodes.value.find((n) => !n.isCompleted) || flatNodes.value[0]
      handleNodeClick(target, target.parentNodeId)
    }
  } catch (error) {
    console.error('初始化课程数据失败:', error)
  }
})

// 目录展开/收起切换
const toggleExpand = (id) => {
  const idx = expandedNodes.value.indexOf(id)
  if (idx > -1) expandedNodes.value.splice(idx, 1)
  else expandedNodes.value.push(id)
}

/**
 * 处理节点切换逻辑
 * @param node 选中的 LEVEL4 节点
 * @param parentId 父级 LEVEL3 节点 ID（用于自动展开）
 */
const handleNodeClick = (node, parentId) => {
  if (!node || currentNode.value?.id === node.id) return

  currentNode.value = node

  // 确保父目录处于展开状态
  if (parentId && !expandedNodes.value.includes(parentId)) {
    expandedNodes.value.push(parentId)
  }

  // 页面滚动重置
  contentScrollRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const goNext = () => {
  if (!isLast.value) {
    const next = flatNodes.value[currentStepIndex.value + 1]
    handleNodeClick(next, next.parentNodeId)
  }
}

const goPrev = () => {
  if (!isFirst.value) {
    const prev = flatNodes.value[currentStepIndex.value - 1]
    handleNodeClick(prev, prev.parentNodeId)
  }
}

const goBack = () => routerBack()
const showCourseGraph = () => router.push({ name: 'StudentKnowledges' })

const loadQuiz = () => {
  router.push({ name: 'StudentCourseQuiz', params: { nodeId: currentNode.value?.id } })
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #f1f5f9;
  border-radius: 10px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background: #e2e8f0;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
  max-height: 800px;
  overflow: hidden;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}
</style>