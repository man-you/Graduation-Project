<template>
  <div
    class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-700 font-sans antialiased"
  >
    <div class="max-w-7xl mx-auto px-3 lg:px-4 py-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
        <div class="max-w-2xl">
          <div class="flex items-center gap-5 mb-6">
            <div
              class="p-3.5 bg-blue-700 dark:bg-blue-600 rounded-2xl text-white shadow-2xl shadow-blue-700/20"
            >
              <PhGraph size="32" weight="bold" />
            </div>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-blue-600 dark:text-white">
              我的课程
            </h1>
          </div>
          <p
            class="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed tracking-tight px-1"
          >
            {{
              isTeacher
                ? '管理您的课程，构建系统化的教学内容。'
                : '构建系统化知识图谱，通过量化进度开启深度学习之旅。'
            }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div class="relative w-full sm:w-72 group">
            <PhMagnifyingGlass
              class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-700 transition-colors"
              :size="18"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索课程名称..."
              class="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-4 focus:ring-blue-700/5 focus:border-blue-700 transition-all shadow-sm"
            />
          </div>

          <button
            v-if="isTeacher"
            @click="navToCreate"
            class="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-700/10 active:scale-95"
          >
            <PhPlusCircle weight="bold" :size="20" />
            <span>创建新课程</span>
          </button>
        </div>
      </div>

      <div v-if="isLoading" class="flex flex-col items-center justify-center py-48">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p class="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400">加载中...</p>
      </div>

      <div v-else-if="filteredCourses.length > 0">
        <TransitionGroup
          name="course-grid"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div
            v-for="course in filteredCourses"
            :key="course.id"
            class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col max-h-[480px] hover:border-blue-700/40 transition-all duration-500 shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)] overflow-hidden"
          >
            <div class="p-8 flex-1 flex flex-col">
              <div class="flex items-start gap-4 mb-6">
                <div
                  class="shrink-0 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-blue-700 dark:text-blue-400"
                >
                  <PhGraduationCap
                    weight="bold"
                    size="28"
                    class="transition-transform group-hover:-rotate-3"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <h3
                    class="text-2xl pt-2 font-bold text-slate-600 dark:text-slate-100 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
                  >
                    {{ course.title }}
                  </h3>
                  <div
                    v-if="!isTeacher && course.isCompleted"
                    class="mt-2 inline-block px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-[11px] font-black tracking-widest uppercase border border-emerald-100 dark:border-emerald-500/20"
                  >
                    已完成
                  </div>
                </div>
              </div>

              <p
                class="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-8 line-clamp-3 font-medium"
              >
                {{ course.description }}
              </p>

              <div class="mt-auto">
                <div
                  class="inline-flex items-center gap-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-700"
                >
                  <PhClock size="16" class="text-blue-700 dark:text-blue-400" />
                  预计时长 {{ Math.round(course.estimatedDuration / 60) }} 分钟
                </div>
              </div>
            </div>

            <div
              class="px-8 pt-6 pb-8 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800"
            >
              <template v-if="!isTeacher">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-[11px] font-black text-slate-400 uppercase tracking-widest"
                    >学习进度</span
                  >
                  <span class="text-sm font-bold text-blue-700 dark:text-blue-400"
                    >{{ course.progress }}%</span
                  >
                </div>
                <div
                  class="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-8"
                >
                  <div
                    class="h-full bg-blue-700 dark:bg-blue-500 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: `${course.progress}%` }"
                  ></div>
                </div>
                <button
                  @click="navToCourse(course.id)"
                  class="w-full py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>{{ course.progress === 100 ? '复习课程' : '继续学习' }}</span>
                  <PhArrowRight size="16" />
                </button>
              </template>

              <template v-else>
                <div class="grid grid-cols-2 gap-4">
                  <button
                    @click="confirmDeleteCourse(course)"
                    class="flex items-center justify-center gap-2 py-4 border-2 border-red-50 dark:border-red-900/20 text-red-600 hover:bg-red-50 rounded-2xl text-sm font-bold transition-all active:scale-95"
                  >
                    <PhTrash size="18" />
                    <span>删除</span>
                  </button>
                  <button
                    @click="navToCourse(course.id)"
                    class="flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl text-sm font-bold transition-all shadow-md active:scale-95"
                  >
                    <PhGear size="18" />
                    <span>管理课程</span>
                  </button>
                </div>
              </template>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-48 bg-white dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800"
      >
        <PhGhost size="80" weight="thin" class="text-slate-300 dark:text-slate-700 mb-8" />
        <h3 class="text-2xl font-bold text-slate-800 dark:text-slate-200">未发现匹配课程</h3>
        <p class="text-slate-400 mt-3 text-lg font-medium">请尝试其他关键词搜索或创建新内容</p>
      </div>
    </div>

    <ResultModal
      v-if="modalState.visible"
      v-bind="modalState"
      @confirm="handleModalConfirm"
      @close="modalState.visible = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { useAuthStore } from '@/stores/auth.store'
import ResultModal from '@/components/ResultModal.vue'
import type { Course } from '@/types/course.type'

// --- 基础状态 ---
const router = useRouter()
const courseStore = useCourseStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const deleteTargetCourse = ref<Course | null>(null)
const modalState = reactive({
  visible: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: '',
  buttonText: '',
})

// --- 计算属性 ---
const isLoading = computed(() => courseStore.loading)
const isTeacher = computed(() => authStore.userRole === 'teacher')

const filteredCourses = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return courseStore.courseList.filter(
    (c) => c.title.toLowerCase().includes(query) || c.description.toLowerCase().includes(query),
  )
})

// --- 生命周期 ---
onMounted(() => {
  courseStore.getCourseList(true)
})

// --- 导航方法 ---
const navToCourse = (id: number) => {
  router.push(
    isTeacher.value
      ? { name: 'TeacherNodeManage', params: { courseId: id } }
      : { name: 'StudentCourseDetail', params: { id } },
  )
}

const navToCreate = () => {
  router.push({
    name: 'TeacherNodeCreate',
    params: { courseId: 0 },
    query: { level: 'LEVEL1', from: 'courseList' },
  })
}

// --- 业务方法 ---
const confirmDeleteCourse = (course: Course) => {
  deleteTargetCourse.value = course
  Object.assign(modalState, {
    visible: true,
    type: 'error',
    title: '确认删除',
    message: `您确定要永久删除《${course.title}》吗？`,
    buttonText: '确认删除',
  })
}

const handleModalConfirm = async () => {
  // 如果当前处于“确认删除”状态（即有待删除目标）
  if (deleteTargetCourse.value) {
    try {
      await courseStore.deleteCourse(deleteTargetCourse.value.id)
      deleteTargetCourse.value = null
      Object.assign(modalState, {
        visible: true,
        type: 'success',
        title: '删除成功',
        message: '课程已移除',
        buttonText: '确定',
      })
    } catch (e) {
      Object.assign(modalState, {
        visible: true,
        type: 'error',
        title: '删除失败',
        message: '请稍后重试',
        buttonText: '重试',
      })
    }
  } else {
    modalState.visible = false
  }
}
</script>

<style scoped>
.course-grid-enter-active,
.course-grid-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.course-grid-enter-from,
.course-grid-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
