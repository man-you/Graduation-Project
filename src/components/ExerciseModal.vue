<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6"
        @click="handleClose"
      >
        <!-- 模态框主体 -->
        <div
          class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative transition-all duration-300"
          :class="{ 'pointer-events-none select-none opacity-80': isGenerating }"
          @click.stop
        >
          <!-- 头部区域 -->
          <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white z-20"
          >
            <h2 class="text-lg font-extrabold text-slate-800 flex items-center gap-2.5">
              <span class="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              {{ isEditing ? '编辑练习题' : '新建练习题' }}
            </h2>
            <div class="flex items-center gap-3">
              <button
                @click="toggleAIPanel"
                :disabled="isGenerating"
                class="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                :class="
                  showAIPanel
                    ? 'bg-blue-100 text-blue-700 shadow-inner'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                "
              >
                <PhSparkle
                  :size="18"
                  weight="fill"
                  :class="showAIPanel && !isGenerating ? 'animate-pulse' : ''"
                />
                {{ showAIPanel ? '取消 AI 辅助' : 'AI 辅助完善' }}
              </button>
              <button
                @click="handleClose"
                :disabled="isGenerating"
                class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <PhX :size="20" weight="bold" />
              </button>
            </div>
          </div>

          <!-- AI 面板 -->
          <transition name="slide-down">
            <div
              v-if="showAIPanel"
              class="bg-gradient-to-b from-blue-50/50 to-white border-b border-blue-100 shrink-0 z-10 relative overflow-hidden"
            >
              <div class="p-6 pb-8">
                <div class="flex items-start gap-4">
                  <div class="flex-1 relative group">
                    <textarea
                      v-model="aiPromptInput"
                      :placeholder="
                        isEditing
                          ? '描述如何修改此题目内容...'
                          : '输入关键词，AI 将自动匹配题型并填充表单...'
                      "
                      class="w-full p-4 bg-white border border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none resize-none h-[100px] text-sm text-slate-700 shadow-sm"
                      :disabled="isGenerating"
                    ></textarea>
                  </div>
                  <button
                    @click="startAIGeneration"
                    :disabled="isGenerating || !aiPromptInput.trim()"
                    class="shrink-0 w-[120px] h-[48px] mt-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.97] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                  >
                    <PhMagicWand v-if="!isGenerating" :size="18" weight="fill" />
                    <span class="text-sm">{{ isGenerating ? '思考中...' : '开始生成' }}</span>
                  </button>
                </div>
              </div>
              <div
                v-if="isGenerating"
                class="absolute bottom-0 left-0 w-full h-1 bg-blue-100 overflow-hidden"
              >
                <div class="progress-bar-value h-full bg-blue-600"></div>
              </div>
            </div>
          </transition>

          <!-- 表单主体 -->
          <div class="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/50 relative">
            <div class="p-6 sm:p-8 space-y-6">
              <form id="exerciseForm" @submit.prevent="handleSubmit" class="space-y-6">
                <!-- 基础配置 -->
                <div
                  class="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <div class="space-y-2">
                    <label class="text-[13px] font-black text-slate-500 uppercase tracking-wider"
                      >题型选择</label
                    >
                    <div class="relative">
                      <select
                        v-model="form.type"
                        :disabled="isEditing || isGenerating"
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                      >
                        <option v-for="opt in TYPE_OPTIONS" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                        </option>
                      </select>
                      <div
                        v-if="isEditing"
                        class="absolute right-3 top-3 text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded font-bold"
                      >
                        锁定
                      </div>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-[13px] font-black text-slate-500 uppercase tracking-wider"
                      >题目分值</label
                    >
                    <input
                      v-model.number="form.score"
                      :disabled="isGenerating"
                      type="number"
                      class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold"
                    />
                  </div>
                </div>

                <!-- 题目内容 -->
                <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
                  <div class="space-y-2">
                    <label class="text-[13px] font-black text-slate-500 uppercase tracking-wider"
                      >题目标题</label
                    >
                    <input
                      v-model.trim="form.exerciseTitle"
                      :disabled="isGenerating"
                      type="text"
                      class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm"
                      placeholder="例如：Vue3 生命周期..."
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[13px] font-black text-slate-500 uppercase tracking-wider"
                      >题目正文</label
                    >
                    <textarea
                      v-model.trim="form.exerciseContent"
                      :disabled="isGenerating"
                      rows="4"
                      class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none resize-none text-sm leading-relaxed"
                      placeholder="请输入详细的题目描述..."
                    ></textarea>
                  </div>
                </div>

                <!-- 动态答案/选项区域 -->
                <div
                  v-if="form.type === 'FILL_BLANK'"
                  class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm"
                >
                  <label
                    class="text-[13px] font-black text-slate-500 uppercase tracking-wider block mb-3"
                    >填空正确答案</label
                  >
                  <input
                    v-model.trim="form.blankAnswer"
                    :disabled="isGenerating"
                    class="w-full px-4 py-3 bg-blue-50/30 border border-blue-100 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-bold text-blue-700"
                    placeholder="标准答案"
                  />
                </div>

                <div
                  v-else
                  class="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4"
                >
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-[13px] font-black text-slate-500 uppercase tracking-wider"
                      >选项配置</label
                    >
                    <button
                      v-if="canAddOption"
                      :disabled="isGenerating"
                      type="button"
                      @click="addOption"
                      class="text-xs text-blue-600 font-bold hover:text-blue-700 flex items-center gap-1"
                    >
                      <span class="text-lg">+</span> 添加备选项
                    </button>
                  </div>
                  <div class="space-y-3">
                    <div
                      v-for="(option, index) in form.options"
                      :key="index"
                      class="group flex items-center gap-3 p-3 rounded-xl border transition-all"
                      :class="
                        option.isCorrect
                          ? 'bg-blue-50/50 border-blue-200'
                          : 'bg-slate-50 border-slate-100'
                      "
                    >
                      <span
                        class="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center bg-white border shadow-sm text-xs font-black"
                        :class="
                          option.isCorrect ? 'border-blue-500 text-blue-600' : 'text-slate-400'
                        "
                      >
                        {{ String.fromCharCode(65 + index) }}
                      </span>
                      <input
                        v-model.trim="option.content"
                        :disabled="isGenerating"
                        class="flex-1 bg-transparent border-none outline-none text-sm font-medium"
                        placeholder="选项内容..."
                        :readonly="form.type === 'TRUE_FALSE'"
                      />
                      <label class="relative flex items-center cursor-pointer p-2">
                        <input
                          :type="isMultiple ? 'checkbox' : 'radio'"
                          :checked="option.isCorrect"
                          :disabled="isGenerating"
                          @change="handleChoiceChange(index)"
                          class="hidden"
                        />
                        <div
                          class="w-6 h-6 border-2 rounded-lg transition-all flex items-center justify-center"
                          :class="
                            option.isCorrect
                              ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-100'
                              : 'bg-white border-slate-300'
                          "
                        >
                          <svg
                            v-if="option.isCorrect"
                            class="w-4 h-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="4"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </label>
                      <button
                        v-if="form.type !== 'TRUE_FALSE' && form.options.length > 2"
                        type="button"
                        :disabled="isGenerating"
                        @click="removeOption(index)"
                        class="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                      >
                        <PhTrash :size="18" />
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- 底部操作 -->
          <div
            class="px-6 py-5 border-t border-slate-100 flex items-center justify-end gap-3 bg-white z-20"
          >
            <button
              @click="handleClose"
              :disabled="isGenerating"
              class="px-6 py-2.5 text-slate-500 text-sm font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              取消
            </button>
            <button
              form="exerciseForm"
              type="submit"
              :disabled="isGenerating"
              class="px-10 py-2.5 bg-blue-600 text-white rounded-xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {{ isEditing ? '保存修改' : '保存题目' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat.store'
import { PhX, PhTrash, PhSparkle, PhMagicWand } from '@phosphor-icons/vue'

const props = defineProps<{ show: boolean; editingExercise?: any }>()
const emit = defineEmits(['close', 'submit'])

const route = useRoute()
const chatStore = useChatStore()

const TYPE_OPTIONS = [
  { label: '单选题', value: 'SINGLE_CHOICE' },
  { label: '多选题', value: 'MULTIPLE_CHOICE' },
  { label: '填空题', value: 'FILL_BLANK' },
  { label: '判断题', value: 'TRUE_FALSE' },
]

const getDefaultForm = () => ({
  exerciseTitle: '',
  exerciseContent: '',
  type: 'SINGLE_CHOICE',
  score: 10,
  blankAnswer: '',
  options: [
    { content: '', isCorrect: true },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
    { content: '', isCorrect: false },
  ],
})

const form = ref(getDefaultForm())
const isGenerating = ref(false)
const showAIPanel = ref(false)
const aiPromptInput = ref('')

const isEditing = computed(() => !!props.editingExercise)
const isMultiple = computed(() => form.value.type === 'MULTIPLE_CHOICE')
const canAddOption = computed(() => !['TRUE_FALSE', 'FILL_BLANK'].includes(form.value.type))

let stopWatchingChat: (() => void) | null = null
onBeforeUnmount(() => {
  if (stopWatchingChat) stopWatchingChat()
})

const toggleAIPanel = () => {
  if (isGenerating.value) return
  showAIPanel.value = !showAIPanel.value
  if (showAIPanel.value) aiPromptInput.value = ''
}

const startAIGeneration = async () => {
  if (isGenerating.value) return
  const nodeId = Number(route.params.nodeId)
  if (!nodeId) return alert('缺少节点上下文')

  isGenerating.value = true
  try {
    const currentType = form.value.type as any
    const userPrompt = aiPromptInput.value.trim() || undefined

    const generatePromise = new Promise<any>((resolve, reject) => {
      let timeoutId = window.setTimeout(() => reject(new Error('AI 生成超时')), 30000)
      stopWatchingChat = watch(
        () => ({ messages: chatStore.messages, loading: chatStore.loading }),
        ({ messages, loading }) => {
          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1]
            if (!loading && lastMessage?.role === 'assistant' && !lastMessage.streaming) {
              window.clearTimeout(timeoutId)
              if (stopWatchingChat) {
                stopWatchingChat()
                stopWatchingChat = null
              }
              resolve(lastMessage)
            }
          }
        },
        { deep: true },
      )
      chatStore
        .startAnalysisOrGenerateMode(nodeId, 'generate', currentType, userPrompt)
        .catch(reject)
    })

    const lastMessage = await generatePromise
    const rawContent = lastMessage.content
    const jsonStrMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    const data = JSON.parse(jsonStrMatch ? jsonStrMatch[1] : rawContent)

    // --- 核心更新逻辑 ---

    // 1. 基础信息更新
    form.value.exerciseTitle = data.exerciseTitle || form.value.exerciseTitle
    form.value.exerciseContent = data.exerciseContent || form.value.exerciseContent
    if (data.score) form.value.score = data.score

    // 2. 题型处理：创建模式允许更新，编辑模式禁止更新
    if (!isEditing.value && data.type) {
      if (TYPE_OPTIONS.some((opt) => opt.value === data.type)) {
        form.value.type = data.type
      }
    }

    // 3. 数据回填与互斥清理
    const finalType = form.value.type
    if (finalType === 'FILL_BLANK') {
      form.value.blankAnswer = data.blankAnswer || ''
      form.value.options = [] // 清空选项
    } else {
      form.value.blankAnswer = '' // 清空填空
      if (Array.isArray(data.options)) {
        form.value.options = data.options.map((opt: any) => ({
          content: opt.content || '',
          isCorrect: !!opt.isCorrect,
        }))
        // 修正单选逻辑：确保只有一个正确答案
        if (
          (finalType === 'SINGLE_CHOICE' || finalType === 'TRUE_FALSE') &&
          form.value.options &&
          form.value.options.length > 0
        ) {
          const hasCorrect = form.value.options.some((o) => o.isCorrect)
          if (!hasCorrect && form.value.options[0]) form.value.options[0].isCorrect = true
        }
      }
    }

    showAIPanel.value = false
  } catch (e) {
    console.error(e)
    alert('AI 生成失败，请尝试更具体的描述')
  } finally {
    isGenerating.value = false
    chatStore.clearAnalysisData()
  }
}

watch(
  () => props.show,
  (val) => {
    if (!val) {
      showAIPanel.value = false
      return
    }
    form.value = props.editingExercise
      ? JSON.parse(JSON.stringify(props.editingExercise))
      : getDefaultForm()
  },
)

const handleChoiceChange = (idx: number) => {
  if (isMultiple.value) {
    if (form.value.options[idx]) {
      form.value.options[idx].isCorrect = !form.value.options[idx].isCorrect
    }
  } else {
    form.value.options.forEach((o, i) => (o.isCorrect = i === idx))
  }
}

const addOption = () => form.value.options.push({ content: '', isCorrect: false })
const removeOption = (idx: number) => form.value.options.splice(idx, 1)

const handleClose = () => {
  if (isGenerating.value) return
  emit('close')
}

const handleSubmit = () => {
  if (isGenerating.value) return
  emit('submit', JSON.parse(JSON.stringify(form.value)))
  handleClose()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active > div {
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s ease;
}
.modal-fade-enter-from > div {
  transform: translateY(20px);
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
  max-height: 250px;
}
.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.progress-bar-value {
  width: 100%;
  animation: indeterminateAnimation 1.5s infinite linear;
  transform-origin: 0% 50%;
}

@keyframes indeterminateAnimation {
  0% {
    transform: translateX(0) scaleX(0);
  }
  40% {
    transform: translateX(0) scaleX(0.4);
  }
  100% {
    transform: translateX(100%) scaleX(0.5);
  }
}
</style>
