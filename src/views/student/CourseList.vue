<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-700 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 transform-gpu"
      >
        <div class="transition-all duration-700">
          <div class="flex items-center gap-4 mb-3 group cursor-default">
            <!-- 图标保持不变 -->
            <div
              class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500"
            >
              <PhGraph size="28" weight="fill" />
            </div>

            <!-- 优化后的标题：渐变色 + 极粗字重 -->
            <h1
              class="text-4xl md:text-5xl font-black tracking-tight italic overflow-visible pr-2 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 drop-shadow-sm"
            >
              我的课程
            </h1>
          </div>

          <!-- 副标题也稍作微调，以配合标题的华丽感 -->
          <p
            class="text-slate-500 dark:text-slate-400 text-lg md:text-xl ml-1 font-normal leading-7 tracking-wide"
          >
            汇聚您的知识体系，追踪学习进度，随时开启成长之旅。
          </p>
        </div>

        <div class="relative w-full md:w-96 group">
          <div
            class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors duration-300"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <!-- 优化：更简洁的提示 -->
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索课程关键词..."
            class="w-full bg-white dark:bg-slate-900 border-none rounded-[1.5rem] py-4 pl-12 pr-6 text-slate-700 dark:text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:shadow-[0_15px_40px_rgba(59,130,246,0.12)] outline-none transition-all duration-500"
          />
        </div>
      </div>

      <div v-if="filteredCourses.length > 0">
        <TransitionGroup
          name="course-list"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative"
        >
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] flex flex-col h-full border border-slate-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] hover:-translate-y-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] overflow-hidden transform-gpu active:scale-95"
          >
            <div class="p-8 flex-1 flex flex-col relative z-10">
              <div class="flex justify-end mb-4">
                <div
                  v-if="course.isCompleted"
                  class="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-200/50"
                >
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <!-- 优化：统一为中文 -->
                  已修完
                </div>
              </div>

              <h3
                class="text-2xl font-bold flex items-center gap-2 text-slate-700 dark:text-slate-200 mb-4 group-hover:text-blue-600 transition-colors duration-300 tracking-tight"
              >
                <PhGraduationCap weight="duotone" size="24" class="text-blue-500" />
                <span>{{ course.title }}</span>
              </h3>

              <p
                class="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium"
              >
                {{ course.description }}
              </p>

              <div class="mt-auto">
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800"
                >
                  <PhClock size="16" class="text-blue-500" />
                  <!-- 优化：增加“预计”前缀，语义更完整 -->
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase"
                    >预计 {{ course.estimatedDuration / 60 }} 分钟</span
                  >
                </div>
              </div>
            </div>

            <div
              class="px-8 pb-8 pt-6 bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-md border-t border-slate-100/50 dark:border-slate-800/50"
            >
              <div class="flex items-center justify-between mb-4">
                <!-- 优化：统一为中文 -->
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >学习进度</span
                >
                <span class="text-sm font-bold text-blue-600">{{ course.progress }}%</span>
              </div>

              <div
                class="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6 shadow-inner relative"
              >
                <div
                  class="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative"
                  :style="{ width: `${course.progress}%` }"
                >
                  <div class="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>

              <button
                class="w-full group/btn flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 shadow-lg shadow-blue-500/10"
                @click="loadCourse(course.id)"
              >
                <!-- 优化：更精准的动词 -->
                <span>{{ course.progress === 100 ? '复习课程' : '继续学习' }}</span>
                <PhArrowRight
                  class="w-4 h-4 transform group-hover/btn:translate-x-2 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <!-- 空状态优化 -->
      <div v-else class="text-center py-32">
        <PhGhost size="64" class="mx-auto text-slate-300 mb-6" weight="thin" />
        <h3 class="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">暂无匹配课程</h3>
        <p class="text-slate-400 font-medium">尝试调整搜索关键词，或查看全部内容。</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 保持原有的 script 逻辑不变
import { ref, computed, onMounted } from 'vue'
import { useCourseStore } from '@/stores/course.store'
import { PhClock, PhGraph, PhGraduationCap, PhArrowRight, PhGhost } from '@phosphor-icons/vue'
import { useRouter } from 'vue-router'

const courseStore = useCourseStore()
const searchQuery = ref('')
const router = useRouter()

onMounted(() => {
  courseStore.getCourseList()
})

const filteredCourses = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  const list = courseStore.courseList

  if (!query) return list
  return list.filter(
    (c) => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query),
  )
})

const loadCourse = (courseId: number) => {
  router.push({
    name: 'StudentCourseDetail',
    params: { id: courseId },
  })
}
</script>

<style scoped>
/* 保持原有的 style 不变 */
.course-list-move,
.course-list-enter-active,
.course-list-leave-active {
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.course-list-enter-from,
.course-list-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(40px);
}
.course-list-leave-active {
  position: absolute;
  width: calc(33.333% - 2.5rem);
}
@media (max-width: 1024px) {
  .course-list-leave-active {
    width: calc(50% - 2.5rem);
  }
}
@media (max-width: 768px) {
  .course-list-leave-active {
    width: calc(100% - 2rem);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-20deg);
  }
  100% {
    transform: translateX(250%) skewX(-20deg);
  }
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
