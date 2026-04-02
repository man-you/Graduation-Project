<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div
        v-if="show"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
        @click="handleClose"
      >
        <div
          class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-xl overflow-hidden"
          @click.stop
        >
          <!-- 头部区域 -->
          <div
            class="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white"
          >
            <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2.5">
              <span class="w-1.5 h-5 bg-blue-600 rounded-full"></span>
              {{ isEditing ? '编辑练习题' : '新建练习题' }}
            </h2>
            <button
              @click="handleClose"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <PhX :size="20" weight="bold" />
            </button>
          </div>

          <!-- 表单主体 -->
          <div class="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar bg-slate-50/50">
            <form id="exerciseForm" @submit.prevent="handleSubmit" class="space-y-6">
              <!-- 配置项：题型与分值 -->
              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-700">题型选择</label>
                  <select
                    v-model="form.type"
                    :disabled="isEditing"
                    class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 transition-all outline-none text-slate-700 text-sm cursor-pointer"
                    :class="{ 'opacity-50 cursor-not-allowed': isEditing }"
                  >
                    <option v-for="opt in TYPE_OPTIONS" :key="opt.value" :value="opt.value">
                      {{ opt.label }}
                    </option>
                  </select>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-semibold text-slate-700"
                    >题目分值 <span class="text-rose-500">*</span></label
                  >
                  <input
                    v-model.number="form.score"
                    type="number"
                    min="1"
                    class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 transition-all outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <!-- 题目内容 -->
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700"
                  >题目标题 <span class="text-rose-500">*</span></label
                >
                <input
                  v-model.trim="form.exerciseTitle"
                  type="text"
                  class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 transition-all outline-none text-sm"
                  placeholder="请输入标题"
                  required
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700"
                  >题目正文 <span class="text-rose-500">*</span></label
                >
                <textarea
                  v-model.trim="form.exerciseContent"
                  rows="4"
                  class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 transition-all outline-none resize-none text-sm leading-relaxed"
                  placeholder="支持 Markdown 语法..."
                  required
                ></textarea>
              </div>

              <!-- 答案区域：填空题 -->
              <div
                v-if="form.type === 'FILL_BLANK'"
                class="p-5 bg-white border border-slate-200 rounded-2xl space-y-2"
              >
                <label class="text-sm font-semibold text-slate-700"
                  >标准答案 <span class="text-rose-500">*</span></label
                >
                <input
                  v-model.trim="form.blankAnswer"
                  type="text"
                  class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 transition-all outline-none font-mono text-sm"
                  placeholder="填写正确答案"
                  required
                />
              </div>

              <!-- 答案区域：选项类 -->
              <div v-else class="p-5 bg-white border border-slate-200 rounded-2xl space-y-4">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-semibold text-slate-700"
                    >设置选项 <span class="text-rose-500">*</span></label
                  >
                  <button
                    v-if="canAddOption"
                    type="button"
                    @click="addOption"
                    class="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg font-bold hover:bg-blue-600 hover:text-white transition-all"
                  >
                    + 添加选项
                  </button>
                </div>

                <div class="grid gap-3">
                  <div
                    v-for="(option, index) in form.options"
                    :key="index"
                    class="flex items-center gap-3 p-3 rounded-xl border transition-all"
                    :class="
                      option.isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200 ring-1 ring-emerald-500/20'
                        : 'bg-white border-slate-200'
                    "
                  >
                    <div
                      class="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs transition-colors"
                      :class="
                        option.isCorrect
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      "
                    >
                      {{ String.fromCharCode(65 + index) }}
                    </div>

                    <input
                      v-model.trim="option.content"
                      type="text"
                      class="flex-1 bg-transparent border-none outline-none text-slate-700 text-sm font-medium"
                      placeholder="输入选项内容..."
                      :readonly="form.type === 'TRUE_FALSE'"
                      required
                    />

                    <!-- 选择控制 -->
                    <label
                      class="relative flex items-center justify-center cursor-pointer shrink-0 ml-2"
                    >
                      <input
                        :type="isMultiple ? 'checkbox' : 'radio'"
                        :checked="option.isCorrect"
                        @change="handleChoiceChange(index)"
                        class="peer absolute opacity-0"
                      />
                      <div
                        class="w-5 h-5 border-2 flex items-center justify-center transition-all"
                        :class="[
                          isMultiple ? 'rounded' : 'rounded-full',
                          option.isCorrect
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-slate-300 bg-white peer-hover:border-emerald-400',
                        ]"
                      >
                        <svg
                          v-if="option.isCorrect"
                          class="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="4"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </label>

                    <button
                      v-if="form.type !== 'TRUE_FALSE'"
                      type="button"
                      @click="removeOption(index)"
                      class="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0"
                      :disabled="form.options.length <= (form.type === 'SINGLE_CHOICE' ? 2 : 2)"
                    >
                      <PhTrash :size="16" weight="bold" />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <!-- 底部操作 -->
          <div
            class="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-white"
          >
            <button
              @click="handleClose"
              class="px-5 py-2.5 border border-slate-200 text-slate-600 rounded-xl font-medium text-sm hover:bg-slate-50"
            >
              取消
            </button>
            <button
              form="exerciseForm"
              type="submit"
              class="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
            >
              确认保存
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

const props = defineProps<{ show: boolean; editingExercise?: any }>()
const emit = defineEmits(['close', 'submit'])

// 配置常量
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

// 计算属性
const isEditing = computed(() => !!props.editingExercise)
const isMultiple = computed(() => form.value.type === 'MULTIPLE_CHOICE')
const canAddOption = computed(() => !['TRUE_FALSE', 'FILL_BLANK'].includes(form.value.type))

// 初始化 & 回显逻辑
watch(
  () => props.show,
  (val) => {
    if (!val) return
    if (props.editingExercise) {
      const data = JSON.parse(JSON.stringify(props.editingExercise))
      form.value = { ...getDefaultForm(), ...data }
    } else {
      form.value = getDefaultForm()
    }
  },
)

// 题型切换核心逻辑
watch(
  () => form.value.type,
  (newType, oldType) => {
    if (newType === 'TRUE_FALSE') {
      form.value.options = [
        { content: '正确', isCorrect: true },
        { content: '错误', isCorrect: false },
      ]
    } else if (newType === 'FILL_BLANK') {
      form.value.options = []
    } else if (oldType === 'TRUE_FALSE' || oldType === 'FILL_BLANK') {
      // 从固定题型切回选择题时才重置
      form.value.options = getDefaultForm().options
    } else if (newType === 'SINGLE_CHOICE') {
      // 多选切单选：保留第一个正确项
      const firstIdx = form.value.options.findIndex((o) => o.isCorrect)
      form.value.options.forEach((o, i) => (o.isCorrect = i === (firstIdx === -1 ? 0 : firstIdx)))
    }
  },
)

// 选项操作
const handleChoiceChange = (index: number) => {
  const opts = form.value.options
  if (index < 0 || index >= opts.length) return
  const option = opts[index]
  if (!option) return
  if (isMultiple.value) {
    option.isCorrect = !option.isCorrect
  } else {
    opts.forEach((o, i) => (o.isCorrect = i === index))
  }
}

const addOption = () => form.value.options.push({ content: '', isCorrect: false })
const removeOption = (idx: number) => form.value.options.splice(idx, 1)

const handleClose = () => emit('close')

const handleSubmit = () => {
  const { type, exerciseTitle, exerciseContent, score, options, blankAnswer } = form.value

  // 统一验证所有必填字段
  if (!exerciseTitle.trim()) return alert('请填写题目标题')
  if (!exerciseContent.trim()) return alert('请填写题目正文')
  if (!score || score < 1) return alert('请设置有效的题目分值')

  if (type === 'FILL_BLANK') {
    if (!blankAnswer.trim()) return alert('请填写填空题标准答案')
  } else {
    if (!options.some((o) => o.isCorrect)) return alert('请设置至少一个正确答案')
    if (options.some((o) => !o.content.trim())) return alert('请完整填写所有选项内容')
  }

  // 清洗冗余数据
  const submitData = JSON.parse(JSON.stringify(form.value))
  if (type === 'FILL_BLANK') delete submitData.options
  else delete submitData.blankAnswer

  emit('submit', submitData)
  handleClose()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-fade-enter-from .bg-white,
.modal-fade-leave-to .bg-white {
  transform: translateY(20px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
