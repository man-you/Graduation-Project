import { defineStore } from 'pinia'
import type { Course, CourseNode } from '@/types/course.type'
import {
  getCourseListApi,
  getCourseKnowledgeGraphApi,
  getCouseNodesApi,
  deleteCourseApi
} from '@/api/course.api'

interface GraphData {
  nodes: any[]
  links: any[]
}

export const useCourseStore = defineStore('course', {
  state: () => ({
    // 基础数据
    courseList: [] as Course[],
    CourseNodes: [] as CourseNode[],
    CourseId: null as null | number,

    // 图谱可视化扁平数据
    graphData: { nodes: [], links: [] } as GraphData,
    currentCourseId: null as null | number,

    // 状态控制
    loading: false,
    nodesLoading: false,

    // 缓存管理：Map<ID, {数据, 时间戳}>
    courseDataCache: new Map<number, { data: CourseNode[], timestamp: number }>(),
    CACHE_DURATION: 5 * 60 * 1000, // 5分钟有效期
  }),

  actions: {
    /**
     * 获取课程列表
     * @param force 是否强制刷新
     */
    async getCourseList(force = false) {
      if (!force && this.courseList.length > 0) return

      this.loading = true
      // 强制刷新时清空关联状态，确保数据一致性
      if (force) this.resetAllState()

      try {
        const res = await getCourseListApi()
        this.courseList = res.map((c: Course) => ({
          ...c,
          progress: this.calcProgress(c.duration, c.estimatedDuration),
        }))
      } catch (error) {
        console.error('[CourseStore] 获取列表失败:', error)
        if (force) this.courseList = []
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取课程节点（带智能缓存控制）
     */
    async getCourseNodes(courseId: number, force = false) {
      const now = Date.now()
      const cached = this.courseDataCache.get(courseId)

      // 1. 命中有效缓存逻辑
      if (!force && cached && (now - cached.timestamp < this.CACHE_DURATION)) {
        this.CourseNodes = cached.data
        this.CourseId = courseId
        return
      }

      // 2. 发起网络请求
      this.nodesLoading = true
      try {
        const res = await getCouseNodesApi(courseId)

        // 更新状态与缓存
        this.CourseNodes = res
        this.CourseId = courseId
        this.courseDataCache.set(courseId, { data: [...res], timestamp: now })
      } catch (error) {
        console.error(`[CourseStore] 获取节点失败(ID:${courseId}):`, error)
        this.CourseNodes = []
      } finally {
        this.nodesLoading = false
      }
    },

    /**
     * 获取图谱数据并扁平化处理
     */
    async getGraphData(courseId: number | string) {
      const id = Number(courseId)

      // 先确保节点基础数据已存在（利用 getCourseNodes 的缓存机制）
      await this.getCourseNodes(id)

      this.nodesLoading = true
      try {
        const res = await getCourseKnowledgeGraphApi(id)


        const rootNode = res[0]

        if (rootNode) {
          this.processGraphFlattening(rootNode)
          this.currentCourseId = id
        }
      } catch (error) {
        console.error('[CourseStore] 图谱数据处理失败:', error)
      } finally {
        this.nodesLoading = false
      }
    },

    /**
     * 核心逻辑：递归将嵌套树转为 D3/G6 所需的扁平化结构
     */
    processGraphFlattening(root: CourseNode) {
      const nodes: any[] = []
      const links: any[] = []

      const traverse = (node: CourseNode) => {
        const level = parseInt(node.nodeLevel?.replace('LEVEL', '') || '1')

        // 资源预处理：仅 LEVEL4 需要提取首个资源对象
        let processedResource = node.resource
        if (level === 4 && Array.isArray(node.resource)) {
          processedResource = node.resource[0] || null
        }

        nodes.push({
          ...node,
          name: node.nodeName,
          level,
          resource: processedResource
        })

        if (node.childNodes?.length) {
          node.childNodes.forEach(child => {
            links.push({ source: node.id, target: child.id })
            traverse(child)
          })
        }
      }

      traverse(root)
      this.graphData = { nodes, links }
    },

    /**
     * 删除课程及其关联缓存
     */
    async deleteCourse(courseId: number) {
      try {
        await deleteCourseApi(courseId)

        // 1. 同步课程列表
        this.courseList = this.courseList.filter(c => c.id !== courseId)

        // 2. 清理缓存 Map
        this.courseDataCache.delete(courseId)

        // 3. 如果删除的是当前查看的课程，重置明细状态
        if (this.CourseId === courseId || this.currentCourseId === courseId) {
          this.resetDetailState()
        }
      } catch (error) {
        console.error('[CourseStore] 删除课程失败:', error)
        throw error
      }
    },

    // --- 辅助工具方法 ---

    calcProgress(cur = 0, total = 0): number {
      if (!total || total <= 0) return 0
      return Math.min(100, Math.round((cur / total) * 100))
    },

    resetDetailState() {
      this.CourseNodes = []
      this.CourseId = null
      this.currentCourseId = null
      this.graphData = { nodes: [], links: [] }
    },

    resetAllState() {
      this.courseList = []
      this.resetDetailState()
    }
  }
})
