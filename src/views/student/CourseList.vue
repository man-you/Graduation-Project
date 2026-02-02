<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-700 font-sans">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div
        class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 transform-gpu"
      >
        <div class="transition-all duration-700">
          <div class="flex items-center gap-4 mb-3 group cursor-default">
            <div
              class="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform duration-500"
            >
              <PhGraph size="28" weight="fill" />
            </div>
            <h1
              class="text-4xl font-extrabold text-slate-700 dark:text-slate-200 tracking-tight italic"
            >
              我的课程
            </h1>
          </div>
          <p class="text-slate-500 dark:text-slate-400 text-lg ml-1 font-medium">
            探索精彩课程，追踪学习进度，随时继续您的学习之旅。
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
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索课程名称..."
            class="w-full bg-white dark:bg-slate-900 border-none rounded-[1.5rem] py-4 pl-12 pr-16 text-slate-700 dark:text-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:shadow-[0_15px_40px_rgba(59,130,246,0.12)] outline-none transition-all duration-500"
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
            <!-- 移除了圆形扩散效果的div -->

            <div class="p-8 flex-1 flex flex-col relative z-10">
              <div class="flex justify-end mb-4">
                <div
                  v-if="course.isCompleted"
                  class="flex items-center gap-1.5 px-3 py-1 bg-emerald-100/80 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-200/50"
                >
                  <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Completed
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
                  <svg
                    class="w-4 h-4 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2.5"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span class="text-xs font-bold text-slate-600 dark:text-slate-300"
                    >{{ course.duration }} MINS</span
                  >
                </div>
              </div>
            </div>

            <div
              class="px-8 pb-8 pt-6 bg-slate-50/50 dark:bg-slate-800/20 backdrop-blur-md border-t border-slate-100/50 dark:border-slate-800/50"
            >
              <div class="flex items-center justify-between mb-4">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                  >Progress</span
                >
                <span class="text-sm font-bold text-blue-600">{{ course.progress }}%</span>
              </div>

              <div
                class="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-6 shadow-inner relative"
              >
                <div
                  class="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 rounded-full transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] relative"
                  :style="{ width: course.progress + '%' }"
                >
                  <div class="absolute inset-0 bg-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>

              <button
                class="w-full group/btn flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-bold text-sm normal-case tracking-wide transition-all duration-300 shadow-lg shadow-blue-500/10"
              >
                <span>{{ course.progress === 100 ? '重温课程' : '继续学习' }}</span>
                <PhArrowRight
                  class="w-4 h-4 transform group-hover/btn:translate-x-2 transition-transform duration-300"
                />
              </button>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div v-else class="text-center py-32 transform-gpu">
        <div
          class="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-slate-100 dark:bg-slate-900 mb-8 transition-transform hover:scale-110 duration-500"
        >
          <svg
            class="w-10 h-10 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2 tracking-tight">
          没有找到相关内容
        </h3>
        <p class="text-slate-400 font-medium text-lg">换个关键词试试看吧？</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const courses = ref([
  {
    id: 1,
    title: '数据结构与算法',
    description: '深入浅出数据结构核心概念，从线性表到高级图论算法，构建扎实的编程基础。',
    duration: 120,
    progress: 75,
    isCompleted: false,
  },
])

const filteredCourses = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return courses.value
  return courses.value.filter(
    (c) => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query),
  )
})
</script>

<style scoped>
/* 列表平滑重排动画 */
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
  width: 100%;
}

/* 进度条流光特效 */
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-20deg);
  }
  100% {
    transform: translateX(250%) skewX(-20deg);
  }
}

/* 限制文字行数 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 硬件加速补丁 */
.transform-gpu {
  will-change: transform, opacity;
  backface-visibility: hidden;
}
</style>
