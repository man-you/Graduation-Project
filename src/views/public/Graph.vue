<template>
  <div
    class="relative w-full h-screen bg-slate-50 overflow-hidden font-sans text-slate-700 selection:bg-blue-100"
  >
    <div
      class="absolute inset-0 z-0 opacity-40 pointer-events-none"
      style="
        background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
        background-size: 24px 24px;
      "
    ></div>

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div v-if="isLegendExpanded" class="flex flex-col">
              <span class="text-sm font-bold text-slate-800 leading-none">数据结构</span>
              <span class="text-[10px] text-slate-500 font-medium mt-0.5">知识图谱可视化</span>
            </div>
            <div v-else class="hidden group-hover:block whitespace-nowrap pl-1 pr-2">
              <span class="text-sm font-bold text-slate-700">展开图谱</span>
            </div>
          </div>

          <div v-if="isLegendExpanded" class="text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </div>
        </div>

        <div v-if="isLegendExpanded" class="px-4 pb-4 pt-1 border-t border-slate-100/50">
          <p class="text-xs text-slate-500 mb-3 leading-relaxed">
            双击节点聚焦，拖拽调整布局。<br />包含
            <span class="font-bold text-indigo-600">22</span> 份核心教学资源。
          </p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-rose-500"></span> 课程
            </div>
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-blue-500"></span> 模块
            </div>
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> 考点
            </div>
            <div
              class="flex items-center gap-2 text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100"
            >
              <span class="w-2 h-2 rounded-full bg-violet-500"></span> PPT
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
      <button
        @click="resetZoom"
        class="p-2 bg-white text-slate-600 rounded-lg shadow-lg border border-slate-100 hover:text-blue-600 hover:bg-blue-50 transition"
        title="重置视图"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
      </button>
    </div>

    <div
      ref="chartContainer"
      class="w-full h-full cursor-grab active:cursor-grabbing z-10 touch-none"
    ></div>

    <transition
      enter-active-class="transform transition ease-out duration-300"
      enter-from-class="translate-x-[120%] opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transform transition ease-in duration-200"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-x-[120%] opacity-0"
    >
      <div v-if="selectedNode" class="absolute right-6 top-6 bottom-6 w-96 z-30 flex flex-col">
        <div
          class="flex-1 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/50 flex flex-col overflow-hidden ring-1 ring-slate-900/5"
        >
          <div class="p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
            <div class="flex justify-between items-start">
              <div>
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
                class="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-5 custom-scrollbar">
            <div v-if="selectedNode.level === 4" class="space-y-4">
              <div
                class="bg-gradient-to-br from-violet-50 to-purple-50 p-5 rounded-xl border border-violet-100 shadow-sm relative overflow-hidden group"
              >
                <div
                  class="absolute -right-4 -top-4 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl group-hover:bg-purple-300/40 transition"
                ></div>

                <div class="flex items-start gap-4 relative z-10">
                  <div
                    class="bg-white p-3 rounded-lg shadow-sm text-violet-600 ring-1 ring-violet-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-slate-800">教学课件下载</h3>
                    <p class="text-xs text-slate-500 mt-1">格式: PPTX / 大小: 2.4MB</p>
                  </div>
                </div>

                <div class="mt-4 pt-4 border-t border-violet-200/50 relative z-10">
                  <p
                    class="text-xs text-slate-600 mb-2 font-mono bg-white/60 p-1.5 rounded border border-white/50 truncate"
                  >
                    {{ selectedNode.filename }}.pptx
                  </p>
                  <button
                    class="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition shadow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-sm flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    立即下载
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
                  模块，建议结合代码示例进行学习。
                </p>
              </div>
            </div>

            <div v-else>
              <div class="flex items-center justify-between mb-4">
                <p class="text-sm text-slate-500">
                  包含
                  <strong class="text-slate-800">{{ getChildCount(selectedNode) }}</strong> 个关联项
                </p>
              </div>

              <ul class="space-y-2">
                <li
                  v-for="child in getChildren(selectedNode)"
                  :key="child.id"
                  class="group p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 hover:shadow-md hover:shadow-blue-50 transition-all cursor-pointer flex items-center justify-between"
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
                  <span
                    v-if="child.level === 4"
                    class="text-[10px] font-bold bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded border border-violet-100"
                    >PPT</span
                  >
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-slate-300 group-hover:text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
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
import { onMounted, ref, onUnmounted } from 'vue'
import * as d3 from 'd3'

// --- 状态控制 ---
const isLegendExpanded = ref(true) // 控制左上角图例展开
const chartContainer = ref(null)
const selectedNode = ref(null)
let simulation = null
let svg = null
let zoomBehavior = null // 保存zoom实例以便重置

// --- 数据准备 (结构保持不变) ---
const rawData = {
  name: '数据结构课程',
  level: 1,
  children: [
    {
      name: '线性结构',
      level: 2,
      children: [
        {
          name: '线性表',
          level: 3,
          children: [
            { name: '2.1 线性表的定义', filename: '2.1-线性表-线性表的定义', level: 4 },
            { name: '2.2 顺序存储结构', filename: '2.2-线性表-顺序存储结构', level: 4 },
            { name: '2.3 单链表基本操作', filename: '2.3-线性表-单链表基本操作', level: 4 },
          ],
        },
        {
          name: '栈',
          level: 3,
          children: [
            { name: '3.1 栈的定义与基本操作', filename: '3.1-栈-定义与基本操作', level: 4 },
            { name: '3.2 栈的顺序存储实现', filename: '3.2-栈-顺序存储实现', level: 4 },
          ],
        },
        {
          name: '队列',
          level: 3,
          children: [{ name: '3.3 队列的定义与操作', filename: '3.3-队列-定义与操作', level: 4 }],
        },
        {
          name: '数组',
          level: 3,
          children: [{ name: '4.1 数组的定义与存储', filename: '4.1-数组-定义与存储', level: 4 }],
        },
      ],
    },
    {
      name: '树形结构',
      level: 2,
      children: [
        {
          name: '二叉树',
          level: 3,
          children: [
            { name: '5.1 二叉树定义与性质', filename: '5.1-二叉树-定义与性质', level: 4 },
            { name: '5.2 二叉树的三种遍历', filename: '5.2-二叉树-三种遍历', level: 4 },
          ],
        },
        {
          name: '二叉搜索树',
          level: 3,
          children: [
            { name: '7.1 二叉搜索树定义与操作', filename: '7.1-二叉搜索树-定义与操作', level: 4 },
          ],
        },
        {
          name: '哈夫曼树',
          level: 3,
          children: [
            { name: '5.5 哈夫曼树构造与应用', filename: '5.5-哈夫曼树-构造与应用', level: 4 },
          ],
        },
      ],
    },
    {
      name: '图形结构',
      level: 2,
      children: [
        {
          name: '图',
          level: 3,
          children: [
            { name: '9.1 图的定义与术语', filename: '9.1-图-定义与术语', level: 4 },
            { name: '9.2 图的存储', filename: '9.2-图-存储', level: 4 },
          ],
        },
        {
          name: '图的遍历',
          level: 3,
          children: [
            { name: '9.3 DFS深度优先遍历', filename: '9.3-图的遍历-DFS', level: 4 },
            { name: '9.3 BFS广度优先遍历', filename: '9.3-图的遍历-BFS', level: 4 },
          ],
        },
        {
          name: '最短路径',
          level: 3,
          children: [
            { name: '9.5 Dijkstra单源最短路径', filename: '9.5-最短路径-Dijkstra', level: 4 },
          ],
        },
      ],
    },
    {
      name: '查找技术',
      level: 2,
      children: [
        {
          name: '查找算法',
          level: 3,
          children: [
            { name: '6.3 折半查找', filename: '6.3-查找算法-折半查找', level: 4 },
            { name: '8.1 散列函数构造', filename: '8.1-查找算法-散列函数构造', level: 4 },
            { name: '8.2 冲突处理方法', filename: '8.2-查找算法-冲突处理方法', level: 4 },
          ],
        },
      ],
    },
    {
      name: '排序算法',
      level: 2,
      children: [
        {
          name: '经典排序',
          level: 3,
          children: [
            { name: '10.2 冒泡排序', filename: '10.2-经典排序-冒泡排序', level: 4 },
            { name: '10.4 快速排序', filename: '10.4-经典排序-快速排序', level: 4 },
            { name: '10.5 归并排序', filename: '10.5-经典排序-归并排序', level: 4 },
          ],
        },
      ],
    },
  ],
}

// --- 工具函数 ---
// 新的配色方案：更柔和、专业
const colorScale = d3
  .scaleOrdinal()
  .domain([1, 2, 3, 4])
  .range(['#F43F5E', '#3B82F6', '#10B981', '#8B5CF6']) // Rose, Blue, Emerald, Violet

const getNodeTypeName = (level) => {
  const map = { 1: '核心课程', 2: '知识模块', 3: '核心考点', 4: '教学资源' }
  return map[level] || '节点'
}

// 辅助样式类
const getBadgeClass = (level) => {
  const map = {
    1: 'bg-rose-50 text-rose-600 border-rose-200',
    2: 'bg-blue-50 text-blue-600 border-blue-200',
    3: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    4: 'bg-violet-50 text-violet-600 border-violet-200',
  }
  return map[level]
}

const getParentName = (node) => (node.parent ? node.parent.name : '无')

const flattenData = (root) => {
  const nodes = []
  const links = []
  function recurse(node, parentId = null) {
    const newNode = { ...node, id: nodes.length, parentId }
    nodes.push(newNode)
    if (parentId !== null) links.push({ source: parentId, target: newNode.id })
    if (node.children) node.children.forEach((child) => recurse(child, newNode.id))
  }
  recurse(root)
  return { nodes, links }
}

const graphData = flattenData(rawData)

const getChildren = (node) => graphData.nodes.filter((n) => n.parentId === node.id)
const getChildCount = (node) => getChildren(node).length

const focusNode = (node) => {
  const d3Node = d3
    .select(chartContainer.value)
    .selectAll('circle')
    .data()
    .find((d) => d.id === node.id)
  if (d3Node) {
    selectedNode.value = d3Node

    // 可选：点击列表时，视图自动平移到该节点
    svg
      .transition()
      .duration(750)
      .call(
        zoomBehavior.transform,
        d3.zoomIdentity
          .translate(chartContainer.value.clientWidth / 2, chartContainer.value.clientHeight / 2)
          .scale(1.5)
          .translate(-d3Node.x, -d3Node.y),
      )
  }
}

// 重置缩放
const resetZoom = () => {
  if (svg && zoomBehavior) {
    svg.transition().duration(750).call(zoomBehavior.transform, d3.zoomIdentity)
  }
}

// --- D3 逻辑 ---
const initGraph = () => {
  if (!chartContainer.value) return

  const width = chartContainer.value.clientWidth
  const height = chartContainer.value.clientHeight

  d3.select(chartContainer.value).selectAll('*').remove()

  svg = d3
    .select(chartContainer.value)
    .append('svg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('viewBox', [0, 0, width, height])
    .style('max-width', '100%')
    .style('height', 'auto')

  const g = svg.append('g')

  // 保存 zoom 行为以便后续调用
  zoomBehavior = d3
    .zoom()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      g.attr('transform', event.transform)
    })

  svg.call(zoomBehavior)

  simulation = d3
    .forceSimulation(graphData.nodes)
    .force(
      'link',
      d3
        .forceLink(graphData.links)
        .id((d) => d.id)
        .distance((d) => (d.target.level === 4 ? 40 : d.target.level === 3 ? 80 : 120)),
    )
    .force(
      'charge',
      d3.forceManyBody().strength((d) => {
        // 稍微增强斥力，让布局更舒展
        return d.level === 1 ? -1200 : d.level === 4 ? -80 : -400
      }),
    )
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force(
      'collide',
      d3.forceCollide().radius((d) => (d.level === 1 ? 50 : d.level === 2 ? 35 : 25)),
    )

  // 连线样式优化
  const link = g
    .append('g')
    .attr('stroke', '#94a3b8') // slate-400
    .attr('stroke-opacity', 0.4)
    .selectAll('line')
    .data(graphData.links)
    .join('line')
    .attr('stroke-width', (d) => Math.max(1, 3 - d.target.level * 0.5)) // 线条变细一点

  const node = g
    .append('g')
    .selectAll('.node')
    .data(graphData.nodes)
    .join('g')
    .attr('class', 'node group')
    .call(drag(simulation))

  // 节点增加阴影滤镜
  const defs = svg.append('defs')
  const filter = defs.append('filter').attr('id', 'drop-shadow').attr('height', '130%')
  filter
    .append('feGaussianBlur')
    .attr('in', 'SourceAlpha')
    .attr('stdDeviation', 3)
    .attr('result', 'blur')
  filter
    .append('feOffset')
    .attr('in', 'blur')
    .attr('dx', 2)
    .attr('dy', 2)
    .attr('result', 'offsetBlur')
  filter
    .append('feMerge')
    .selectAll('feMergeNode')
    .data(['offsetBlur', 'SourceGraphic'])
    .enter()
    .append('feMergeNode')
    .attr('in', (d) => d)

  // 节点圆圈
  node
    .append('circle')
    .attr('r', (d) => {
      if (d.level === 1) return 32
      if (d.level === 2) return 22
      if (d.level === 3) return 14
      return 6
    })
    .attr('fill', (d) => colorScale(d.level))
    .attr('stroke', '#fff')
    .attr('stroke-width', 3) // 边框加粗一点，更清晰
    .style('filter', 'url(#drop-shadow)') // 应用阴影
    .attr('class', 'cursor-pointer transition-all duration-300 hover:brightness-110')
    .on('click', (event, d) => {
      event.stopPropagation()
      selectedNode.value = d
      d.parent = graphData.nodes.find((n) => n.id === d.parentId)
    })

  // 增加 hover 时的光晕效果（可选，用简单的 scale 代替）
  node
    .on('mouseover', function () {
      d3.select(this).select('circle').transition().duration(200).attr('transform', 'scale(1.1)')
    })
    .on('mouseout', function () {
      d3.select(this).select('circle').transition().duration(200).attr('transform', 'scale(1)')
    })

  // 节点文字
  node
    .append('text')
    .text((d) => (d.level === 4 ? '' : d.name))
    .attr('x', (d) => (d.level === 1 ? 40 : 28))
    .attr('y', 5)
    .attr('font-size', (d) => (d.level === 1 ? '16px' : '13px'))
    .attr('font-weight', (d) => (d.level < 3 ? '700' : '500'))
    .attr('fill', '#334155')
    .style('pointer-events', 'none')
    .style('text-shadow', '2px 2px 4px rgba(255,255,255,0.8)') // 更强的描边效果

  node.append('title').text((d) => d.name)

  simulation.on('tick', () => {
    link
      .attr('x1', (d) => d.source.x)
      .attr('y1', (d) => d.source.y)
      .attr('x2', (d) => d.target.x)
      .attr('y2', (d) => d.target.y)
    node.attr('transform', (d) => `translate(${d.x},${d.y})`)
  })
}

const drag = (simulation) => {
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }
  function dragged(event, d) {
    d.fx = event.x
    d.fy = event.y
  }
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
  return d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended)
}

onMounted(() => {
  setTimeout(() => initGraph(), 100)
  window.addEventListener('resize', initGraph)
})

onUnmounted(() => {
  window.removeEventListener('resize', initGraph)
  if (simulation) simulation.stop()
})
</script>

<style scoped>
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
