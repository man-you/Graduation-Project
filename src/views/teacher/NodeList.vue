<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased text-slate-800">
    <div class="max-w-5xl mx-auto">
      <header class="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 px-1">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="flex items-center justify-center w-10 h-10 -ml-2 mb-4 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-500 hover:bg-slate-100 hover:text-blue-600 hover:border-blue-100 transition-colors"
          >
            <PhArrowLeft :size="20" weight="bold" />
          </button>

          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-xl font-bold tracking-tight text-slate-900">课程大纲管理</h1>
              <span
                class="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[11px] font-bold uppercase border border-blue-100"
              >
                教师模式
              </span>
            </div>
            <p class="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <PhTreeStructure :size="16" class="text-slate-400" />
              <span>结构化大纲：共 {{ flatNodes.length }} 个知识节点</span>
            </p>
          </div>
        </div>
      </header>

      <div class="space-y-3 relative">
        <div v-if="loading" class="py-24 flex flex-col items-center justify-center gap-4">
          <div
            class="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"
          ></div>
          <span class="text-sm text-slate-400 font-medium">正在构建知识树...</span>
        </div>

        <div
          v-else-if="!flatNodes.length"
          class="py-20 bg-white rounded-3xl border border-slate-200 text-center shadow-sm"
        >
          <div
            class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <PhSteps :size="32" weight="duotone" class="text-slate-300" />
          </div>
          <h3 class="text-slate-600 text-lg font-bold">暂无教学计划</h3>
          <p class="text-slate-400 mt-1 mb-6">点击下方或课程管理来创建第一个章节</p>
          <button
            @click="goToCreateNode('LEVEL1')"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors"
          >
            立即创建一级章节
          </button>
        </div>

        <template v-for="(node, index) in flatNodes" :key="node.id">
          <div
            class="group relative flex items-center bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5"
            :style="{ marginLeft: `${node.depth * 2.5}rem` }"
          >
            <div
              v-if="node.depth > 0"
              class="absolute -left-[1.25rem] top-0 bottom-1/2 w-[1.25rem] border-l-2 border-b-2 border-slate-200 rounded-bl-xl"
            ></div>

            <div class="flex items-center gap-4 flex-1 min-w-0 z-10">
              <button
                v-if="node.hasChildren"
                @click.stop="toggleNode(node.id)"
                class="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                <component
                  :is="node.isExpanded ? PhCaretDown : PhCaretRight"
                  weight="bold"
                  :size="12"
                />
              </button>

              <div v-else class="w-7 shrink-0 flex justify-center">
                <div
                  :class="
                    node.nodeLevel === 'LEVEL4' ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-slate-300'
                  "
                  class="w-2 h-2 rounded-full transition-all"
                ></div>
              </div>

              <div class="flex flex-col min-w-0 pr-4">
                <div class="flex items-center gap-3">
                  <span
                    class="text-[15px] font-bold text-slate-700 truncate group-hover:text-blue-600 transition-colors"
                  >
                    {{ node.nodeName }}
                  </span>
                  <span
                    :class="getLevelBadgeClass(node.nodeLevel)"
                    class="text-[9px] px-2 py-0.5 rounded-full font-black tracking-tighter uppercase border border-current transition-all"
                  >
                    {{ LEVEL_CONFIG[node.nodeLevel as NodeLevel].label }}
                  </span>
                </div>
                <p
                  v-if="node.description"
                  class="text-xs text-slate-400 mt-1 truncate font-medium max-w-xl"
                >
                  {{ node.description }}
                </p>
              </div>
            </div>

            <div
              class="flex items-center gap-1 bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm"
            >
              <!-- 1. 管理资源 -->
              <button
                v-show="node.nodeLevel === 'LEVEL1'"
                @click="goToManageResources(node)"
                class="group relative flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              >
                <PhFolderOpen :size="16" weight="bold" />
              </button>

              <!-- 2. 习题管理 -->
              <button
                v-show="node.nodeLevel === 'LEVEL4'"
                @click="goToManageCourses(node)"
                class="group relative flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
              >
                <PhNotebook :size="16" weight="bold" />
              </button>

              <!-- 3. 添加子项 -->
              <button
                v-if="node.nodeLevel !== 'LEVEL4'"
                @click="goToCreateNode(getNextLevel(node.nodeLevel), node.id)"
                class="group relative flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
              >
                <PhPlus :size="16" weight="bold" />
              </button>

              <!-- 4. 编辑 -->
              <button
                @click="goToEditNode(node)"
                class="group relative flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
              >
                <PhPencilSimple :size="16" weight="bold" />
              </button>

              <!-- 分割线 -->
              <div class="w-px h-4 bg-slate-200 mx-1"></div>

              <!-- 5. 删除 -->
              <button
                v-if="node.nodeLevel !== 'LEVEL1'"
                @click="handleDelete(node.id)"
                class="group relative flex items-center justify-center p-2 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
              >
                <PhTrash :size="16" weight="bold" />
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCourseStore } from '@/stores/course.store'
import { useNodeStore } from '@/stores/node.store'
import { LEVEL_CONFIG, type NodeLevel } from '@/types/node.type'
import { PhCaretDown, PhCaretRight, PhFolderOpen, PhNotebook } from '@phosphor-icons/vue'
/** * 1. 基础状态与 Store
 */
const route = useRoute()
const router = useRouter()
const nodeStore = useNodeStore()
const courseStore = useCourseStore()

const courseId = Number(route.params.courseId)
// 使用 Set 存储展开节点的 ID，查询复杂度为 O(1)
const expandedNodeIds = ref(new Set<number>())

const loading = computed(() => nodeStore.loading)

/** * 2. 核心逻辑：树转平铺列表
 * 将嵌套的 tree 结构转化为带 depth 信息的数组，方便 v-for 直接渲染
 */
const flatNodes = computed(() => {
  const result: any[] = []

  // 使用辅助函数进行深度优先遍历 (DFS)
  const flatten = (nodes: any[], depth = 0) => {
    for (const node of nodes) {
      const isExpanded = expandedNodeIds.value.has(node.id)
      const hasChildren = !!(node.childNodes && node.childNodes.length > 0)

      result.push({
        ...node,
        depth,
        hasChildren,
        isExpanded,
      })

      // 如果节点已展开且有子节点，继续递归
      if (isExpanded && hasChildren) {
        flatten(node.childNodes, depth + 1)
      }
    }
  }

  flatten(nodeStore.nodes)
  return result
})

/** * 3. 交互操作函数
 */

// 切换展开/折叠
const toggleNode = (id: number) => {
  if (expandedNodeIds.value.has(id)) {
    expandedNodeIds.value.delete(id)
  } else {
    expandedNodeIds.value.add(id)
  }
}

// 跳转至创建页面
const goToCreateNode = (level: NodeLevel, parentNodeId: number | null = null) => {
  router.push({
    name: 'TeacherNodeCreate',
    params: { courseId },
    query: { level, ...(parentNodeId && { parentNodeId }) },
  })
}

// 跳转至编辑页面
const goToEditNode = (node: any) => {
  router.push({
    name: 'TeacherNodeEdit',
    params: { courseId, nodeId: node.id },
  })
}

// 跳转至资源管理页面
const goToManageResources = (node: any) => {
  router.push({
    name: 'TeacherFiles',
    query: { courseId: node.id },
  })
}

// 跳转至习题管理页面
const goToManageCourses = (node: any) => {
  router.push({
    name: 'TeacherQuiz',
    params: { nodeId: node.id },
  })
}

// 删除节点
const handleDelete = async (id: number) => {
  if (!confirm('确定删除吗？操作将影响所有关联的学习资源。')) return
  await nodeStore.handleOperation('delete', { id })
  // 删除后尝试刷新列表
  nodeStore.getNodes(courseId, true)
}

/** * 4. 辅助工具函数
 */

// 计算下一级 Level 字符串 (例如 LEVEL1 -> LEVEL2)
const getNextLevel = (currentLevel: string): NodeLevel => {
  const num = parseInt(currentLevel.replace('LEVEL', ''))
  return `LEVEL${num + 1}` as NodeLevel
}

// 获取层级 UI 样式
const getLevelBadgeClass = (level: string) => {
  const styles: Record<string, string> = {
    LEVEL1: 'text-indigo-500 bg-indigo-50 border-indigo-100',
    LEVEL2: 'text-amber-500 bg-amber-50 border-amber-100',
    LEVEL3: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    LEVEL4: 'text-blue-500 bg-blue-50 border-blue-100',
  }
  return styles[level] || 'text-slate-400 bg-slate-50 border-slate-100'
}

const goBack = () => router.push({ name: 'TeacherCourses' })

/** * 5. 生命周期与监听
 */
onMounted(() => {
  // 仅在 Store 为空时获取课程列表，减少冗余请求
  if (courseStore.courseList.length === 0) courseStore.getCourseList()
  nodeStore.getNodes(courseId)
})

// 监听路由返回，如果是从编辑/创建页面回来，自动刷新数据
watch(
  () => route.name,
  (name) => {
    if (name === 'TeacherNodeManage') {
      nodeStore.getNodes(courseId, true)
    }
  },
)
</script>

<style scoped>
/* 操作按钮基础样式 */
.btn-action {
  @apply w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-white hover:shadow-sm active:scale-95;
}

/* 简单的进出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
