<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased text-slate-800">
    <div class="max-w-5xl mx-auto">
      <header class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="flex items-center justify-center w-10 h-10 -ml-2 mb-4 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-blue-600 hover:border-blue-100 transition-colors"
            title="返回上一页"
          >
            <PhArrowLeft :size="20" />
          </button>

          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold tracking-tight">
                {{ isEditMode ? `编辑${levelLabel}` : `创建新${levelLabel}` }}
              </h1>
              <span
                class="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100"
              >
                {{ isEditMode ? '更新' : '新建' }}
              </span>
            </div>
            <p class="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <PhBookOpen :size="16" />
              <span>所属课程：{{ currentCourse?.title || '载入中...' }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="px-5 py-2.5 text-slate-600 font-medium text-sm hover:text-slate-900 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveNode"
            :disabled="!form.nodeName.trim() || saving"
            class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div
              v-if="saving"
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            <span>{{ isEditMode ? '保存更改' : '确认创建' }}</span>
          </button>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-8">
            <div class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700"> 节点名称 </label>
                <input
                  v-model="form.nodeName"
                  class="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-colors outline-none text-base text-slate-800 placeholder:text-slate-400"
                  :placeholder="`请输入${levelLabel}的名称...`"
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">
                  详细描述 / 教学目标
                </label>
                <textarea
                  v-model="form.description"
                  rows="6"
                  maxlength="500"
                  class="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-colors outline-none text-sm leading-relaxed text-slate-700 resize-none placeholder:text-slate-400"
                  placeholder="请输入该章节的详细介绍或学习目标..."
                ></textarea>
                <div class="flex justify-between items-center text-xs text-slate-500 mt-1">
                  <span>建议包含核心考核点与知识要点</span>
                  <span>{{ form.description?.length || 0 }} / 500</span>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">
                  预计花费时间 (秒)
                </label>
                <template v-if="currentLevel === 'LEVEL4'">
                  <div class="relative">
                    <input
                      v-model.number="form.estimatedDuration"
                      type="number"
                      min="0"
                      class="w-full px-4 py-3 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg transition-colors outline-none text-base text-slate-800 placeholder:text-slate-400"
                      placeholder="例如：1800"
                    />
                    <PhClock
                      class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      :size="18"
                    />
                  </div>
                  <p class="text-xs text-slate-500 mt-1">建议根据知识点难度合理设置学习时长</p>
                </template>
                <template v-else>
                  <div
                    class="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                  >
                    <PhLockKeyhole :size="18" />
                    <span class="text-sm font-medium">{{ form.estimatedDuration || 0 }} 秒</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1">
                    该值由下级 LEVEL4 节点自动汇总计算，不可手动修改
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-white rounded-2xl border border-slate-200 p-6">
            <h4 class="text-sm font-bold text-slate-800 mb-5 flex items-center gap-2">
              <PhTreeStructure class="text-slate-400" :size="18" />
              层级关系
            </h4>

            <div class="space-y-4">
              <div>
                <p class="text-xs font-medium text-slate-500 mb-2">当前级别</p>
                <span
                  class="px-3 py-1.5 rounded-md text-xs font-semibold border bg-slate-50 text-slate-700 border-slate-200"
                >
                  {{ levelLabel }}
                </span>
              </div>

              <div v-if="parentNode" class="pt-4 border-t border-slate-100">
                <p class="text-xs font-medium text-slate-500 mb-2">上级父节点</p>
                <p class="text-sm font-medium text-slate-800 truncate">
                  {{ parentNode.nodeName }}
                </p>
              </div>
            </div>
          </div>

          <div class="p-6 bg-blue-50 border border-blue-100 rounded-2xl text-blue-900">
            <div class="flex items-center gap-2 mb-3">
              <PhLightbulb :size="20" class="text-blue-600" />
              <h5 class="text-sm font-bold">教师编写指南</h5>
            </div>
            <p class="text-sm text-blue-800/80 leading-relaxed">
              优秀的教学节点应具备单一性与完整性。请确保标题能直接反映知识核心，避免使用模糊的描述，以帮助
              AI 生成更加精确的内容。
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { useNodeStore } from '@/stores/node.store'
import { LEVEL_CONFIG, type NodeLevel } from '@/types/node/node.type'
import {
  PhArrowLeft,
  PhBookOpen,
  PhTreeStructure,
  PhLightbulb,
  PhClock,
  PhKeyhole,
} from '@phosphor-icons/vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const nodeStore = useNodeStore()

const courseId = Number(route.params.courseId)
const nodeIdParam = route.params.nodeId
const isEditMode = nodeIdParam !== 'new' && nodeIdParam !== undefined
const nodeId = isEditMode ? Number(nodeIdParam) : null
const fromSource = route.query.from as string | undefined

const saving = ref(false)
const currentLevel = ref<NodeLevel>((route.query.level as NodeLevel) || 'LEVEL1')

const form = reactive({
  id: nodeId || 0,
  nodeName: '',
  description: '',
  estimatedDuration: null as number | null,
  nodeLevel: currentLevel.value,
  parentNodeId: route.query.parentNodeId ? Number(route.query.parentNodeId) : null,
})

const currentCourse = computed(() => courseStore.courseList.find((c) => c.id === courseId))
const levelLabel = computed(() => LEVEL_CONFIG[currentLevel.value]?.label || '未知层级')

const findNodeById = (id: number): any => {
  const walk = (nodes: any[]): any => {
    for (const node of nodes) {
      if (node.id === id) return node
      if (node.childNodes) {
        const found = walk(node.childNodes)
        if (found) return found
      }
    }
    return null
  }
  return walk(nodeStore.nodes)
}

const parentNode = computed(() => {
  const pId = isEditMode ? findNodeById(nodeId!)?.parentNodeId : form.parentNodeId
  return pId ? findNodeById(pId) : null
})

const goBack = () => {
  if (fromSource === 'courseList' && !isEditMode) {
    router.push({ name: 'TeacherCourses' })
  } else {
    router.push({ name: 'TeacherNodeManage', params: { courseId } })
  }
}

const saveNode = async () => {
  if (!form.nodeName.trim()) return
  saving.value = true
  try {
    const payload = {
      nodeName: form.nodeName,
      description: form.description,
      ...(currentLevel.value === 'LEVEL4' && { estimatedDuration: form.estimatedDuration }),
    }

    if (isEditMode) {
      await nodeStore.handleOperation('update', { id: form.id, dto: payload })
    } else {
      const createPayload = {
        ...form,
        courseId,
        ...(currentLevel.value !== 'LEVEL4' && { estimatedDuration: undefined }),
      }
      await nodeStore.handleOperation('create', createPayload)

      if (currentLevel.value === 'LEVEL1') {
        await courseStore.getCourseList(true)
      }
    }
    goBack()
  } catch (err) {
    console.error('Save failed:', err)
  } finally {
    saving.value = false
  }
}

onMounted(async () => {
  if (!courseStore.courseList.length) await courseStore.getCourseList()
  await nodeStore.getNodes(courseId)

  if (isEditMode) {
    const data = findNodeById(nodeId!)
    if (data) {
      form.id = data.id
      form.nodeName = data.nodeName
      form.description = data.description || ''
      form.estimatedDuration = data.estimatedDuration
      form.nodeLevel = data.nodeLevel
      currentLevel.value = data.nodeLevel
    }
  }
})
</script>

<style scoped>
/* 移除浏览器默认的数字输入框上下箭头，保持界面干净 */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
