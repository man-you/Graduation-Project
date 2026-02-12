<template>
  <div
    class="relative w-full h-screen bg-slate-50 overflow-hidden font-sans text-slate-700 selection:bg-blue-100"
  >
    <!-- 背景网格图案 -->
    <div
      class="absolute inset-0 z-0 opacity-40 pointer-events-none"
      style="
        background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
        background-size: 24px 24px;
      "
    ></div>

    <!-- 数据加载时的loading状态 -->
    <div
      v-if="nodesLoading"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300"
    >
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-slate-500 font-medium animate-pulse">正在构建知识图谱...</p>
    </div>

    <!-- 左上角图例面板 -->
    <div class="absolute top-6 left-6 z-20 flex flex-col gap-2 pointer-events-none select-none">
      <div
        class="bg-white/80 backdrop-blur-md border border-white/60 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden pointer-events-auto transition-all duration-500 ease-out group"
        :class="isLegendExpanded ? 'w-72' : 'w-12 h-12 rounded-full hover:w-auto hover:rounded-2xl'"
      >
        <div
          @click="isLegendExpanded = !isLegendExpanded"
          class="flex items-center p-3 cursor-pointer hover:bg-slate-50 transition-colors"
          :class="isLegendExpanded ? 'justify-between' : 'justify-center'"
        >
          <div class="flex items-center gap-3">
            <div
              class="bg-gradient-to-tr from-blue-600 to-indigo-500 text-white p-1.5 rounded-lg shadow-md shrink-0"
            >
              <!-- 图标：知识图谱 - 替换为 PhGraph -->
              <PhGraph width="18" height="18" />
            </div>
            <div v-if="isLegendExpanded" class="flex flex-col">
              <span class="text-sm font-bold text-slate-800 leading-none">知识体系</span>
              <span class="text-[10px] text-slate-500 font-medium mt-0.5">Knowledge Graph</span>
            </div>
          </div>
          <div v-if="isLegendExpanded" class="text-slate-400">
            <!-- 箭头图标：收起/展开 - 替换为 PhCaretRight -->
            <PhCaretRight width="16" height="16" />
          </div>
        </div>

        <!-- 图例说明内容 -->
        <div v-if="isLegendExpanded" class="px-4 pb-4 pt-1 border-t border-slate-100/50">
          <p class="text-xs text-slate-500 mb-3 leading-relaxed">双击节点聚焦，拖拽调整布局。</p>
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1.5 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-rose-500"></span> 课程
            </div>
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1.5 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-blue-500"></span> 模块
            </div>
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1.5 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 考点
            </div>
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1.5 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-violet-500"></span> PDF/PPT
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右下角控制按钮 -->
    <div class="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
      <button
        @click="resetZoom"
        class="p-2.5 bg-white text-slate-600 rounded-xl shadow-lg border border-slate-100 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
        title="重置视图"
      >
        <!-- 重置视图图标 - 替换为 PhPlus -->
        <PhPlus width="20" height="20" />
      </button>
    </div>

    <!-- 知识图谱渲染容器 -->
    <div
      ref="chartContainer"
      class="w-full h-full cursor-grab active:cursor-grabbing z-10 touch-none"
    ></div>

    <!-- 侧边栏：节点详情 -->
    <transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-x-[120%] opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-x-0 opacity-0 opacity-100"
      leave-to-class="translate-x-[120%] opacity-0"
    >
      <div v-if="selectedNode" class="absolute right-6 top-6 bottom-6 w-96 z-30 flex flex-col">
        <div
          class="flex-1 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 flex flex-col overflow-hidden ring-1 ring-slate-900/5"
        >
          <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
            <div class="flex justify-between items-start">
              <div>
                <!-- 节点类型标签 -->
                <span
                  class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 border"
                  :class="getBadgeClass(selectedNode.level)"
                >
                  {{ getNodeTypeName(selectedNode.level) }}
                </span>
                <h2 class="text-xl font-extrabold text-slate-800 leading-tight">
                  {{ selectedNode.name }}
                </h2>
              </div>
              <button
                @click="selectedNode = null"
                class="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-1 rounded-full transition-colors"
              >
                <!-- 关闭按钮图标 - 替换为 PhX -->
                <PhX width="22" height="22" />
              </button>
            </div>
          </div>

          <!-- 节点详细内容 -->
          <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <!-- 教学资源节点（第4层）的特殊显示 -->
            <div v-if="selectedNode.level === 4" class="space-y-4">
              <div
                class="bg-gradient-to-br from-indigo-50 to-blue-50 p-5 rounded-xl border border-blue-100 shadow-sm relative overflow-hidden group"
              >
                <div class="flex items-start gap-4 relative z-10">
                  <div class="bg-white p-3 rounded-lg shadow-sm text-blue-600 ring-1 ring-blue-100">
                    <!-- 文件图标 - 替换为 PhPaperPlaneTilt -->
                    <PhPaperPlaneTilt width="32" height="32" />
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800">
                      {{ selectedNode.resource?.resourceName || '教学文档' }}
                    </h3>
                    <p class="text-xs text-slate-500 mt-1">
                      格式: {{ selectedNode.resource?.fileFormat || 'PDF' }} / 大小:
                      {{ selectedNode.resource?.fileSize || '-' }}KB
                    </p>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-blue-200/50 relative z-10">
                  <!-- 下载按钮 -->
                  <button
                    @click="
                      handleDownload(
                        selectedNode.resource?.signedUrl,
                        selectedNode.resource?.resourceName,
                      )
                    "
                    class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition shadow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
                  >
                    <!-- 下载图标 - 替换为 PhDownloadSimple -->
                    <PhDownloadSimple width="18" height="18" />
                    确认下载
                  </button>
                </div>
              </div>

              <div
                class="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100"
              >
                <h4 class="font-bold text-slate-700 mb-1 flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 上级归属
                </h4>
                <p>
                  该知识点属于
                  <span class="font-semibold text-blue-600">{{ getParentName(selectedNode) }}</span>
                  模块。
                </p>
              </div>
            </div>

            <!-- 非教学资源节点的显示（1-3层）：显示子节点列表 -->
            <div v-else>
              <div class="flex items-center justify-between mb-4">
                <p class="text-sm text-slate-500">
                  包含
                  <strong class="text-slate-800">{{ getChildCount(selectedNode) }}</strong> 个关联项
                </p>
              </div>

              <!-- 子节点列表 -->
              <ul class="space-y-2">
                <li
                  v-for="child in getChildren(selectedNode)"
                  :key="child.id"
                  class="group p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                  @click="focusNode(child)"
                >
                  <div class="flex items-center gap-3">
                    <div
                      class="w-2 h-2 rounded-full transition-all group-hover:scale-125"
                      :class="child.level === 4 ? 'bg-violet-400' : 'bg-blue-400'"
                    ></div>
                    <span class="text-sm font-medium text-slate-700 group-hover:text-blue-700">{{
                      child.name
                    }}</span>
                  </div>
                  <!-- 箭头图标：指向子节点 - 替换为 PhArrowRight -->
                  <PhArrowRight
                    width="16"
                    height="16"
                    class="text-slate-300 group-hover:text-blue-400"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, watch } from 'vue'
import * as d3 from 'd3'
import { storeToRefs } from 'pinia'
import { useCourseStore } from '@/stores/course.store'

// --- Store 集成 ---
const courseStore = useCourseStore()
const { graphData, nodesLoading } = storeToRefs(courseStore)

// --- 状态控制 ---
const isLegendExpanded = ref(true) // 图例面板是否展开
const chartContainer = ref(null) // 图表容器DOM引用
const selectedNode = ref(null) // 当前选中的节点

// --- D3 全局引用 ---
let simulation = null // D3力导向图模拟器
let svg = null // SVG根元素
let zoomBehavior = null // 缩放行为
let currentLinks = [] // 当前链接关系

// --- 核心功能：PDF文件下载 ---
/**
 * @param {string} url - 后端返回的 signedUrl 访问地址
 * @param {string} name - 下载时建议的文件名
 */
const handleDownload = (url, name) => {
  if (!url) {
    alert('下载链接无效，请检查网络或刷新重试')
    return
  }

  // 使用创建临时 a 标签的方式触发浏览器强制下载
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', name || '下载文件.pdf')
  link.setAttribute('target', '_blank')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// --- 配置项 ---
// 节点颜色映射：根据层级分配不同颜色
const colorScale = d3
  .scaleOrdinal()
  .domain([1, 2, 3, 4])
  .range(['#F43F5E', '#3B82F6', '#10B981', '#8B5CF6'])

// 获取节点类型的文本描述
const getNodeTypeName = (level) => {
  const map = { 1: '核心课程', 2: '知识模块', 3: '细分考点', 4: '教学资源' }
  return map[level] || '节点'
}

// 获取节点类型的样式类
const getBadgeClass = (level) => {
  const map = {
    1: 'bg-rose-50 text-rose-600 border-rose-200',
    2: 'bg-blue-50 text-blue-600 border-blue-200',
    3: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    4: 'bg-violet-50 text-violet-600 border-violet-200',
  }
  return map[level]
}

// --- 关系辅助函数 ---
// 获取父节点名称
const getParentName = (node) => {
  if (!node) return '无'
  const link = currentLinks.find((l) => l.target.id === node.id)
  return link && link.source ? link.source.name : '无'
}

// 获取子节点数组
const getChildren = (node) => {
  if (!node) return []
  return currentLinks.filter((l) => l.source.id === node.id).map((l) => l.target)
}

// 获取子节点数量
const getChildCount = (node) => getChildren(node).length

// --- 生命周期与交互 ---
// 初始化：获取知识图谱数据
onMounted(async () => {
  const courseId = 121
  await courseStore.getGraphData(courseId)
})

// 监听图谱数据变化，重新渲染图表
watch(
  () => graphData.value,
  (newData) => {
    if (newData && newData.nodes && newData.nodes.length > 0) {
      // 重要：D3 会原地修改数据对象，必须深拷贝以免破坏 Vue 响应式状态
      const nodesCopy = JSON.parse(JSON.stringify(newData.nodes))
      const linksCopy = JSON.parse(JSON.stringify(newData.links))
      initGraph(nodesCopy, linksCopy)
    }
  },
  { deep: true },
)

// 聚焦到指定节点
const focusNode = (node) => {
  selectedNode.value = node
  if (svg && zoomBehavior) {
    svg
      .transition()
      .duration(750)
      .call(
        zoomBehavior.transform,
        d3.zoomIdentity
          .translate(chartContainer.value.clientWidth / 2, chartContainer.value.clientHeight / 2)
          .scale(1.5)
          .translate(-node.x, -node.y),
      )
  }
}

// 重置缩放
const resetZoom = () => {
  if (svg && zoomBehavior) {
    svg.transition().duration(750).call(zoomBehavior.transform, d3.zoomIdentity)
  }
}

// --- D3 渲染引擎 ---
// 初始化图谱渲染
const initGraph = (nodes, links) => {
  if (!chartContainer.value) return
  if (simulation) simulation.stop()
  d3.select(chartContainer.value).selectAll('*').remove()

  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight

  // 创建SVG元素
  svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])

  const g = svg.append('g')

  // 设置缩放功能
  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.1, 4]) // 缩放范围
    .on('zoom', (e) => g.attr('transform', e.transform)) // 缩放时更新变换
  svg.call(zoomBehavior)

  // 力导向图配置
  simulation = d3
    .forceSimulation(nodes)
    .force(
      'link',
      d3
        .forceLink(links)
        .id((d) => d.id) // 节点ID访问器
        .distance((d) => (d.target.level === 4 ? 60 : 120)), // 不同层级的连接距离
    )
    .force(
      'charge', // 排斥力
      d3.forceManyBody().strength((d) => (d.level === 1 ? -2000 : -600)),
    )
    .force('center', d3.forceCenter(width / 2, height / 2)) // 中心引力
    .force('collide', d3.forceCollide().radius(40)) // 碰撞检测

  currentLinks = links

  // 绘制连接线
  const link = g
    .append('g')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-opacity', 0.5)
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke-width', (d) => Math.max(1, 3 - d.target.level * 0.5))

  // 绘制节点组
  const node = g
    .append('g')
    .selectAll('.node')
    .data(nodes)
    .join('g')
    .attr('class', 'node cursor-grab active:cursor-grabbing')
    .on('click', (e, d) => {
      e.stopPropagation()
      selectedNode.value = d
    })
    .call(
      d3
        .drag()
        .on('start', (e, d) => {
          if (!e.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x // 固定位置
          d.fy = d.y
        })
        .on('drag', (e, d) => {
          d.fx = e.x // 更新固定位置
          d.fy = e.y
        })
        .on('end', (e, d) => {
          if (!e.active) simulation.alphaTarget(0)
          d.fx = null // 释放固定
          d.fy = null
        }),
    )

  // 节点圆形
  node
    .append('circle')
    .attr('r', (d) => (d.level === 1 ? 32 : d.level === 2 ? 22 : 14)) // 不同层级不同半径
    .attr('fill', (d) => colorScale(d.level)) // 根据层级着色
    .attr('stroke', '#fff')
    .attr('stroke-width', 3)
    .style('filter', 'drop-shadow(0px 4px 6px rgba(0,0,0,0.1))')

  // 节点文字
  node
    .append('text')
    .text((d) => (d.level === 4 ? '' : d.name)) // 第4层节点不显示文字（避免遮挡）
    .attr('dy', 40) // 文字垂直偏移
    .attr('text-anchor', 'middle') // 文字居中对齐
    .attr('font-size', (d) => (d.level === 1 ? '14px' : '11px')) // 不同层级字体大小
    .attr('font-weight', 'bold')
    .attr('fill', '#475569')
    .style('pointer-events', 'none') // 忽略鼠标事件

  // 力导向图每帧更新回调
  simulation.on('tick', () => {
    // 更新连接线位置
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)

    // 更新节点位置
    node.attr('transform', (d) => `translate(${d.x},${d.y})`)
  })
}

// 组件卸载时停止力导向图模拟
onUnmounted(() => {
  if (simulation) simulation.stop()
})
</script>

<style scoped>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
