<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased text-slate-800">
    <div class="max-w-7xl mx-auto">
      <!-- 头部区域 -->
      <header class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-1">
        <div class="flex items-center gap-4">
          <button
            @click="router.back()"
            class="flex items-center justify-center w-10 h-10 -ml-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-all shadow-sm"
          >
            <PhArrowLeft :size="20" weight="bold" />
          </button>
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold tracking-tight text-slate-900">习题管理</h1>
              <span
                class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold uppercase border border-blue-100"
                >教师模式</span
              >
            </div>
            <p class="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <span>当前知识节点:</span>
              <code class="text-slate-600 font-mono text-xs font-semibold">{{
                currentNodeId
              }}</code>
            </p>
          </div>
        </div>

        <button
          @click="openModal()"
          class="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
        >
          <PhPlus :size="16" weight="bold" />
          新建练习题
        </button>
      </header>

      <!-- 状态渲染: 加载中 -->
      <div v-if="loading" class="py-24 flex flex-col items-center justify-center gap-4">
        <div
          class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
        <span class="text-sm text-slate-400 font-medium">正在加载题库数据...</span>
      </div>

      <!-- 状态渲染: 空数据 -->
      <div
        v-else-if="exercises.length === 0"
        class="py-20 bg-white rounded-3xl border border-slate-200 text-center shadow-sm"
      >
        <div
          class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100"
        >
          <PhNotebook :size="32" weight="duotone" class="text-slate-400" />
        </div>
        <h3 class="text-slate-600 text-lg font-bold">题库空空如也</h3>
        <p class="text-slate-400 mt-1 mb-6 text-sm">当前知识点下还没有任何练习。</p>
        <button
          @click="openModal()"
          class="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-colors border border-blue-100"
        >
          开始添加第一道题
        </button>
      </div>

      <!-- 习题列表 -->
      <div v-else class="space-y-4">
        <div
          v-for="ex in exercises"
          :key="ex.id"
          class="group relative bg-white border border-slate-200 rounded-2xl p-6 transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div class="flex items-start justify-between mb-4 gap-4">
            <div class="flex items-center gap-3 flex-wrap">
              <span
                :class="getTypeStyle(ex.type)"
                class="text-[11px] px-2 py-0.5 rounded-md font-bold tracking-wider border"
              >
                {{ TYPE_MAP[ex.type]?.label || '未知' }}
              </span>
              <span
                class="flex items-center gap-1 text-slate-500 text-xs font-medium px-2 py-1 rounded-md bg-slate-50 border border-slate-100"
              >
                {{ ex.score }} 分
              </span>
            </div>

            <!-- 操作区 -->
            <div
              class="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm"
            >
              <div class="w-px h-3 bg-slate-200 mx-0.5"></div>
              <button
                @click="openModal(ex)"
                class="p-1.5 rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <PhPencilSimple :size="16" weight="bold" />
              </button>
              <div class="w-px h-3 bg-slate-200 mx-0.5"></div>
              <button
                @click="handleDelete(ex.id)"
                class="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              >
                <PhTrash :size="16" weight="bold" />
              </button>
            </div>
          </div>

          <h3 class="text-base font-bold text-slate-800 mb-3">
            {{ ex.exerciseTitle || '未命名习题' }}
          </h3>

          <div
            class="prose prose-slate max-w-none text-slate-600 text-sm mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100"
            v-html="renderMarkdown(ex.exerciseContent)"
          ></div>

          <!-- 选项渲染 (选择题) -->
          <div v-if="ex.options?.length" class="grid sm:grid-cols-2 gap-3">
            <div
              v-for="(opt, idx) in ex.options"
              :key="idx"
              :class="
                opt.isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'
              "
              class="flex items-center gap-3 p-3 rounded-xl border transition-colors"
            >
              <div
                :class="
                  opt.isCorrect
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500'
                "
                class="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center font-bold text-xs"
              >
                {{ String.fromCharCode(65 + idx) }}
              </div>
              <span
                class="text-sm flex-1"
                :class="{ 'text-emerald-900 font-medium': opt.isCorrect }"
                >{{ opt.content }}</span
              >
              <PhCheckCircle
                v-if="opt.isCorrect"
                :size="18"
                weight="fill"
                class="text-emerald-500"
              />
            </div>
          </div>

          <!-- 答案渲染 (填空题) -->
          <div
            v-else-if="ex.blankAnswer"
            class="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-xl"
          >
            <div
              class="w-8 h-8 bg-white border border-blue-100 rounded-lg flex items-center justify-center text-blue-500 shadow-sm shrink-0"
            >
              <PhKey :size="16" weight="bold" />
            </div>
            <div>
              <div class="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-0.5">
                标准答案
              </div>
              <div class="font-mono font-semibold text-blue-900 text-sm">{{ ex.blankAnswer }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 题目模态框 -->
      <ExerciseModal
        :show="showModal"
        :editing-exercise="editingExercise"
        @close="closeModal"
        @submit="handleModalSubmit"
      />

      <ResultModal
        v-bind="resultModal"
        @close="resultModal.visible = false"
        @confirm="resultModal.visible = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

import ExerciseModal from '@/components/ExerciseModal.vue'
import ResultModal from '@/components/ResultModal.vue'
import { useQuizStore } from '@/stores/quiz.store'
import { useChatStore } from '@/stores/chat.store'

// --- 常量定义 ---
const TYPE_MAP: Record<string, { label: string; class: string }> = {
  SINGLE_CHOICE: { label: '单选', class: 'text-indigo-500 bg-indigo-50 border-indigo-100' },
  MULTIPLE_CHOICE: { label: '多选', class: 'text-emerald-500 bg-emerald-50 border-emerald-100' },
  FILL_BLANK: { label: '填空', class: 'text-blue-500 bg-blue-50 border-blue-100' },
  TRUE_FALSE: { label: '判断', class: 'text-amber-500 bg-amber-50 border-amber-100' },
}

// --- 状态管理 ---
const route = useRoute()
const router = useRouter()
const quizStore = useQuizStore()
const chatStore = useChatStore()
const { exercises, loading, currentNodeId } = storeToRefs(quizStore)

const showModal = ref(false)
const editingExercise = ref<any>(null)
const resultModal = ref({
  visible: false,
  type: 'success' as 'success' | 'error',
  title: '',
  message: '',
})

// --- 核心逻辑 ---

const loadData = () => {
  const nodeId = Number(route.params.nodeId)
  if (!isNaN(nodeId)) {
    quizStore.getExercises(nodeId)
  }
}

onMounted(loadData)
watch(() => route.params.nodeId, loadData)

const getTypeStyle = (type: string) =>
  TYPE_MAP[type]?.class || 'text-slate-500 bg-slate-50 border-slate-200'

const renderMarkdown = (content: string) => {
  if (!content) return ''
  return DOMPurify.sanitize(marked.parse(content) as string)
}

const openModal = (ex: any = null) => {
  editingExercise.value = ex ? JSON.parse(JSON.stringify(ex)) : null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingExercise.value = null
}

const showFeedback = (type: 'success' | 'error', title: string, message: string) => {
  resultModal.value = { visible: true, type, title, message }
}

/**
 * 提交习题处理
 */
const handleModalSubmit = async (formData: any) => {
  // 1. 基础验证
  if (!formData.exerciseContent?.trim()) {
    return showFeedback('error', '验证失败', '题目内容不能为空')
  }

  try {
    const isEdit = !!editingExercise.value
    const nodeId = Number(route.params.nodeId) || 101

    // 2. 数据结构转换
    const payload = {
      ...formData,
      nodeId,
      options: formData.options?.map((o: any) => ({
        content: o.content,
        isCorrect: !!o.isCorrect,
      })),
    }

    // 3. 题型特定逻辑验证
    if (['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'TRUE_FALSE'].includes(formData.type)) {
      if (!payload.options?.some((o: any) => o.isCorrect)) {
        return showFeedback('error', '未设置答案', '请至少勾选一个正确选项')
      }
    }

    // 4. 调用接口
    if (isEdit) {
      await quizStore.updateExercise({ id: editingExercise.value.id, ...payload })
    } else {
      await quizStore.createExercise(payload)
    }

    // 5. 操作成功后的清理逻辑
    closeModal() // 成功后立即关闭习题模态框
    showFeedback('success', '操作成功', isEdit ? '习题已更新' : '习题已创建')

    // 6. 重新加载数据以确保界面同步更新
    loadData()
  } catch (error) {
    showFeedback('error', '操作失败', '服务器连接错误，请检查网络后再试')
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('确认删除该习题吗？此操作无法撤销。')) return

  try {
    await quizStore.deleteExercise(id)
    showFeedback('success', '删除成功', '该题目已从题库移除')
    // 重新加载数据以确保界面同步更新
    loadData()
  } catch (error) {
    showFeedback('error', '删除失败', '无法删除该习题')
  }
}
</script>

<style scoped>
.prose :where(p):not(:where([class~='not-prose'] *)) {
  margin: 0;
}
.border-3 {
  border-width: 3px;
}
</style>
