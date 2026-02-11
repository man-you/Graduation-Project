<template>
  <div class="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased">
    <aside
      class="w-80 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-10"
    >
      <div
        class="p-6 border-b border-slate-100 flex-shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-20"
      >
        <button
          class="flex items-center text-[14px] font-bold text-blue-600 hover:text-blue-700 transition-colors group mb-5"
          @click="goBack"
        >
          <PhArrowLeft
            :size="14"
            weight="bold"
            class="mr-2 group-hover:-translate-x-0.5 transition-transform"
          />
          返回课程
        </button>
        <h1 class="text-xl font-extrabold tracking-tight text-slate-900 leading-tight mb-4">
          {{ courseTitle }}
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
                  >{{ lvl3.nodeName }}</span
                >
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
                          'w-1.5 h-1.5 rounded-full transition-colors',
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
            >Progress</span
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
        class="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth"
        ref="contentScrollRef"
      >
        <div class="max-w-4xl mx-auto w-full space-y-8 pb-32">
          <PDFViewer :node-id="currentNode.id" :key="currentNode.id" />

          <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 lg:p-14">
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
          </div>
        </div>
      </div>

      <div class="absolute bottom-10 left-0 right-0 z-20 px-6">
        <div
          class="max-w-lg mx-auto bg-slate-900/95 backdrop-blur-xl text-white rounded-3xl p-2 shadow-2xl flex items-center justify-between border border-white/10"
        >
          <button
            @click="goPrev"
            :disabled="isFirst"
            class="flex items-center text-[14px] font-bold text-slate-400 hover:text-white disabled:opacity-20 p-4 rounded-2xl transition-all"
          >
            <PhArrowFatLineLeft :size="18" class="mr-2" weight="fill" /> 上一节
          </button>
          <div class="flex flex-col items-center px-10 border-x border-white/10">
            <span class="text-[14px] font-black font-mono tracking-wider"
              >{{ currentStepIndex + 1 }} / {{ flatNodes.length }}</span
            >
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
import {
  PhArrowLeft,
  PhClock,
  PhCaretRight,
  PhCheckCircle,
  PhPlay,
  PhInfo,
  PhArrowFatLineLeft,
  PhArrowFatLineRight,
} from '@phosphor-icons/vue'

import { useCourseStore } from '@/stores/course.store'
import { routerBack } from '@/util/routerUtil'
import PDFViewer from '@/components/PDFViewer.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// --- Data From Store ---
const { CourseNodes: courseData, courseList } = storeToRefs(courseStore)

// --- Local State ---
const expandedNodes = ref([])
const currentNode = ref(null)
const contentScrollRef = ref(null)

// --- Computed ---
const currentCourseMeta = computed(() => {
  const id = Number(route.params.id)
  return courseList.value.find((c) => c.id === id) || {}
})

const courseTitle = computed(() => {
  if (courseData.value && courseData.value.length > 0) return courseData.value[0].nodeName
  return currentCourseMeta.value.title || '课程详情'
})

const totalDuration = computed(() => {
  const totalSeconds = currentCourseMeta.value.estimatedDuration || 0
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours}h ${minutes}m`
})

// 将嵌套树平铺，方便做“上一节/下一节”跳转
const flatNodes = computed(() => {
  const list = []
  if (!courseData.value || !courseData.value[0]) return list
  courseData.value[0].childNodes?.forEach((l2) => {
    l2.childNodes?.forEach((l3) => {
      l3.childNodes?.forEach((l4) => {
        list.push({ ...l4, parentNodeId: l3.id })
      })
    })
  })
  return list
})

const currentStepIndex = computed(() =>
  flatNodes.value.findIndex((n) => n.id === currentNode.value?.id),
)

const progressPercent = computed(() => {
  const total = flatNodes.value.length
  if (total === 0) return 0
  const completed = flatNodes.value.filter((n) => n.isCompleted).length
  return Math.round((completed / total) * 100)
})

const isFirst = computed(() => currentStepIndex.value <= 0)
const isLast = computed(() => currentStepIndex.value >= flatNodes.value.length - 1)

// --- Methods ---
onMounted(async () => {
  const courseId = Number(route.params.id)
  if (!courseId) return router.push('/course')

  await courseStore.getCourseNodes(courseId)

  // 默认定位到第一个未完成章节
  if (flatNodes.value.length > 0) {
    const firstUnfinished = flatNodes.value.find((n) => !n.isCompleted) || flatNodes.value[0]
    handleNodeClick(firstUnfinished, firstUnfinished.parentNodeId)
  }
})

const toggleExpand = (id) => {
  const idx = expandedNodes.value.indexOf(id)
  idx > -1 ? expandedNodes.value.splice(idx, 1) : expandedNodes.value.push(id)
}

const handleNodeClick = (node, parentId) => {
  if (!node || currentNode.value?.id === node.id) return
  currentNode.value = node

  // 如果父级目录没展开，自动展开它
  if (parentId && !expandedNodes.value.includes(parentId)) {
    expandedNodes.value.push(parentId)
  }

  // 滚动回到顶部
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
  max-height: 500px;
  overflow: hidden;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}
</style>
