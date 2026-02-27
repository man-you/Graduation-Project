<template>
  <div class="h-screen w-full bg-blue-50 text-slate-700 font-sans flex flex-col">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-50 bg-white/90 flex flex-col items-center justify-center"
    >
      <div
        class="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-xs text-slate-400 font-medium">加载中...</p>
    </div>

    <template v-else>
      <header
        class="h-16 px-6 md:px-10 flex items-center justify-between bg-white border-b border-slate-100 flex-shrink-0"
      >
        <div class="flex items-center gap-4">
          <button
            @click="handleBack"
            class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <PhArrowLeft :size="18" weight="bold" />
          </button>
          <h1 class="font-bold text-slate-800 text-base">
            {{ isSubmitted ? '测试结果' : '章节练习' }}
          </h1>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="isSubmitted">
            <span class="text-xs text-slate-400 font-medium">得分</span>
            <span class="text-xl font-bold text-blue-600 font-mono">
              {{ store.submitResult?.totalScore }}
              <span class="text-sm text-slate-300 font-normal"
                >/ {{ store.submitResult?.fullScore }}</span
              >
            </span>
          </template>
          <template v-else>
            <span class="text-xs text-slate-400 font-medium font-mono w-8 text-right"
              >{{ progressPercent }}%</span
            >
            <div class="progress-track" :style="{ '--progress': progressPercent + '%' }">
              <div class="progress-fill"></div>
            </div>
          </template>
        </div>
      </header>

      <main class="flex-1 overflow-hidden flex justify-center py-6 px-4 sm:px-6">
        <div class="w-full max-w-5xl flex gap-8">
          <div class="flex-1 flex flex-col min-w-0">
            <transition name="fade" mode="out-in">
              <div
                :key="currentExerciseIndex"
                class="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden"
              >
                <div class="px-8 py-6 flex items-center justify-between select-none">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl font-bold text-slate-200 font-mono italic">
                      {{ (currentExerciseIndex + 1).toString().padStart(2, '0') }}
                    </span>
                    <span class="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded">
                      {{ getExerciseTypeText(currentExercise?.type) }}
                    </span>
                  </div>

                  <div v-if="isSubmitted">
                    <span
                      v-if="currentResult?.isCorrect"
                      class="text-emerald-500 text-sm font-bold flex items-center gap-1"
                    >
                      <PhCheckCircle :size="16" weight="fill" /> 正确
                    </span>
                    <span v-else class="text-rose-500 text-sm font-bold flex items-center gap-1">
                      <PhXCircle :size="16" weight="fill" /> 错误
                    </span>
                  </div>
                </div>

                <div class="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                  <div class="max-w-3xl mx-auto">
                    <h2 class="text-lg font-bold text-slate-800 leading-relaxed mb-8">
                      {{ currentExercise?.exerciseTitle }}
                      <div
                        v-if="currentExercise?.exerciseContent"
                        class="mt-4 text-base font-normal text-slate-600 whitespace-pre-wrap"
                      >
                        {{ currentExercise?.exerciseContent }}
                      </div>
                    </h2>

                    <div
                      v-if="['SINGLE_CHOICE', 'TRUE_FALSE'].includes(currentExercise?.type)"
                      class="space-y-3"
                    >
                      <button
                        v-for="(option, idx) in currentExercise.options"
                        :key="option.id"
                        @click="!isSubmitted && handleSelectOption(option.id)"
                        :disabled="isSubmitted"
                        :class="[
                          'w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group',
                          getOptionClass(option),
                        ]"
                      >
                        <div
                          :class="[
                            'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors border',
                            getOptionBadgeClass(option),
                          ]"
                        >
                          {{ String.fromCharCode(65 + idx) }}
                        </div>

                        <span class="flex-1 text-[15px] font-medium">{{ option.content }}</span>

                        <template v-if="isSubmitted">
                          <PhCheck
                            v-if="option.id === currentResult?.correctAnswer"
                            :size="20"
                            weight="bold"
                            class="text-emerald-500"
                          />
                          <PhX
                            v-else-if="selectedOption === option.id && !currentResult?.isCorrect"
                            :size="20"
                            weight="bold"
                            class="text-rose-500"
                          />
                        </template>
                      </button>
                    </div>

                    <div v-if="currentExercise?.type === 'FILL_BLANK'" class="space-y-6">
                      <textarea
                        v-model="fillBlankAnswer"
                        :disabled="isSubmitted"
                        rows="4"
                        class="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                        :class="{
                          'border-rose-300 bg-rose-50': isSubmitted && !currentResult?.isCorrect,
                          'border-emerald-300 bg-emerald-50':
                            isSubmitted && currentResult?.isCorrect,
                        }"
                        placeholder="请输入答案..."
                      ></textarea>

                      <div
                        v-if="isSubmitted && !currentResult?.isCorrect"
                        class="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg"
                      >
                        <span class="font-bold text-slate-700">正确答案：</span>
                        <span class="font-mono ml-2">{{ currentResult?.correctAnswer }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="px-8 py-5 border-t border-slate-50 flex items-center justify-between">
                  <div class="flex gap-2">
                    <button
                      @click="navigateExercise(-1)"
                      :disabled="currentExerciseIndex === 0"
                      class="nav-btn"
                    >
                      <PhCaretLeft :size="14" />
                    </button>
                    <button
                      @click="navigateExercise(1)"
                      :disabled="currentExerciseIndex === exercises.length - 1"
                      class="nav-btn"
                    >
                      <PhCaretRight :size="14" />
                    </button>
                  </div>

                  <button
                    v-if="!isSubmitted"
                    @click="handleSubmit"
                    :disabled="submitting"
                    class="h-9 px-6 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <PhSpinner v-if="submitting" class="animate-spin" />
                    <PhPaperPlaneTilt v-else :size="14" />
                    {{ submitting ? '提交中' : '完成并提交' }}
                  </button>
                  <button
                    v-else
                    @click="handleBack"
                    class="text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    退出练习
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div class="w-64 hidden lg:flex flex-col gap-4 flex-shrink-0">
            <div class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                答题卡
              </div>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="(ex, index) in exercises"
                  :key="ex.id"
                  @click="jumpToExercise(index)"
                  :class="[
                    'w-full aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center',
                    getGridClass(ex, index),
                  ]"
                >
                  {{ index + 1 }}
                </button>
              </div>
            </div>

            <div
              v-if="isSubmitted"
              class="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
            >
              <button
                @click="showAnalysis"
                class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                知识测试分析
              </button>
            </div>
          </div>
        </div>
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useExerciseStore } from '@/stores/exercise.store'
import { routerBack } from '@/util/routerUtil'
import {
  PhArrowLeft,
  PhCaretLeft,
  PhCaretRight,
  PhCheckCircle,
  PhXCircle,
  PhSpinner,
  PhCheck,
  PhX,
} from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const store = useExerciseStore()

// --- State ---
// 当前题目索引与作答状态
const currentExerciseIndex = ref(0)
const selectedOption = ref(null)
const fillBlankAnswer = ref('')
const isSubmitted = ref(false)

// --- Computed ---
// 与 store 绑定的响应式派生状态
const exercises = computed(() => store.exercises)
const isLoading = computed(() => store.loading)
const submitting = computed(() => store.submitting)
const currentExercise = computed(() => exercises.value[currentExerciseIndex.value] || null)

// 当前题目的判题结果（仅在提交后可用）
const currentResult = computed(() => {
  if (!isSubmitted.value) return null
  return store.submitResult?.details.find((d) => d.exerciseId === currentExercise.value?.id)
})

// 进度百分比：已作答 / 总题数
const progressPercent = computed(() => {
  if (!exercises.value.length) return 0
  const answeredCount = store.answers.filter((a) => a.selectedOptionId || a.blankAnswer).length
  return Math.round((answeredCount / exercises.value.length) * 100)
})

// --- Lifecycle ---
// 初始化题目与回填作答
onMounted(async () => {
  const nodeId = Number(route.params.nodeId)
  if (!nodeId) return handleBack()
  await store.getExercises(nodeId)
  loadAnswerFromState()
})

// --- Logic ---
// 将当前题目答案同步到 store
const updateAnswerMap = () => {
  if (!currentExercise.value || isSubmitted.value) return
  store.setAnswer(currentExercise.value.id, {
    selectedOptionId: selectedOption.value,
    blankAnswer: fillBlankAnswer.value,
  })
}

// 切题时回填已保存的答案
const loadAnswerFromState = () => {
  const saved = store.answers.find((a) => a.exerciseId === currentExercise.value?.id)
  selectedOption.value = saved?.selectedOptionId || null
  fillBlankAnswer.value = saved?.blankAnswer || ''
}

// 选择选项题答案
const handleSelectOption = (optionId) => {
  selectedOption.value = optionId
  updateAnswerMap()
}

// 上一题 / 下一题
const navigateExercise = (step) => {
  updateAnswerMap()
  currentExerciseIndex.value += step
  loadAnswerFromState()
}

// 答题卡跳转
const jumpToExercise = (index) => {
  updateAnswerMap()
  currentExerciseIndex.value = index
  loadAnswerFromState()
}

// 提交全部题目
const handleSubmit = async () => {
  updateAnswerMap()
  const answeredCount = store.answers.filter((a) => a.selectedOptionId || a.blankAnswer).length
  if (answeredCount < exercises.value.length) {
    if (!confirm(`还有 ${exercises.value.length - answeredCount} 题未完成，确定提交吗？`)) return
  }
  try {
    await store.submitAnswers()
    isSubmitted.value = true
    currentExerciseIndex.value = 0
    loadAnswerFromState()
  } catch (err) {
    /* Error handling */
  }
}

const showAnalysis = () => {
  router.push({
    name: 'StudentAnalysis',
    params: { nodeId: route.params.nodeId },
  })
}

// --- Styles Helper ---
// 1. 选项容器样式（已提交 / 未提交）
const getOptionClass = (option) => {
  if (isSubmitted.value) {
    if (option.id === currentResult.value?.correctAnswer)
      return 'bg-emerald-50 border-emerald-200 text-emerald-700'
    if (selectedOption.value === option.id && !currentResult.value?.isCorrect)
      return 'bg-rose-50 border-rose-200 text-rose-700'
    return 'opacity-50 border-transparent bg-slate-50'
  }
  // 未提交：选中态 / 默认态
  return selectedOption.value === option.id
    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-500'
    : 'border-slate-200 hover:bg-slate-50 text-slate-600 hover:border-slate-300'
}

// 2. 选项序号(A/B/C)样式
const getOptionBadgeClass = (option) => {
  if (isSubmitted.value) {
    if (option.id === currentResult.value?.correctAnswer)
      return 'bg-emerald-200 border-emerald-300 text-emerald-800'
    if (selectedOption.value === option.id && !currentResult.value?.isCorrect)
      return 'bg-rose-200 border-rose-300 text-rose-800'
    return 'bg-transparent border-slate-300'
  }
  return selectedOption.value === option.id
    ? 'bg-blue-600 border-blue-600 text-white'
    : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-500'
}

// 3. 答题卡网格样式
const getGridClass = (ex, index) => {
  const isActive = currentExerciseIndex.value === index

  if (isSubmitted.value) {
    const res = store.submitResult?.details.find((d) => d.exerciseId === ex.id)
    const base = res?.isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
    return isActive ? `ring-2 ring-offset-1 ring-slate-400 ${base}` : base
  }

  if (isActive) return 'bg-blue-600 text-white shadow-md scale-105'

  const hasAnswer = store.answers.find(
    (a) => a.exerciseId === ex.id && (a.selectedOptionId || a.blankAnswer),
  )
  return hasAnswer
    ? 'bg-blue-100 text-blue-600 font-bold'
    : 'bg-slate-50 text-slate-300 hover:bg-slate-100'
}

const getResultById = (id) => store.submitResult?.details.find((d) => d.exerciseId === id)
const handleBack = () => routerBack()
const getExerciseTypeText = (t) =>
  ({ SINGLE_CHOICE: '单选题', FILL_BLANK: '填空题', TRUE_FALSE: '判断题' })[t] || '题目'
</script>

<style scoped>
.nav-btn {
  @apply w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 
         hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed;
}

/* 进度条（通过 --progress 控制宽度，减少内联样式） */
.progress-track {
  @apply w-24 h-1 bg-blue-100 rounded-full overflow-hidden;
}
.progress-fill {
  width: var(--progress, 0%);
  @apply h-full bg-blue-600 rounded-full transition-all duration-500;
}

/* 简单的淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滚动条隐藏或美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
