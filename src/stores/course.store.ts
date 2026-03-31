import { defineStore } from 'pinia'
import type { Course, CourseNode } from '@/types/course/course.type'
import {
  getCourseListApi,
  getCourseKnowledgeGraphApi,
  getCouseNodesApi,
  deleteCourseApi
} from '@/api/course/course.api'

export const useCourseStore = defineStore('course', {
  state: () => ({
    // 课程列表
    courseList: [] as Course[],

    // 用于图谱可视化的扁平化数据
    graphData: {
      nodes: [] as any[],
      links: [] as any[]
    },

    // 基础节点数据状态
    CourseNodes: [] as CourseNode[],
    CourseId: null as null | number,

    // UI 状态
    currentCourseId: null as null | number,
    loading: false,
    nodesLoading: false,

    // 智能缓存：按课程ID缓存完整课程数据
    courseDataCache: new Map<number, { data: CourseNode[], timestamp: number }>(),
    CACHE_DURATION: 5 * 60 * 1000, // 5分钟缓存有效期
  }),

  actions: {
    /**
     * 课程列表获取
     * @param forceFetch 是否强制刷新（忽略缓存/现有数据）
     */
    async getCourseList(forceFetch = false) {
      // 非强制刷新且已有数据时，直接返回
      if (!forceFetch && this.courseList.length > 0) {
        return
      }

      // 强制刷新时先清空现有数据，避免界面短暂显示旧数据
      if (forceFetch) {
        this.courseList = []
        // 重置当前课程相关状态
        this.currentCourseId = null
        this.CourseNodes = []
        this.CourseId = null
        // 清空图谱数据
        this.graphData = { nodes: [], links: [] }
      }

      this.loading = true
      try {
        const res = await getCourseListApi()
        this.courseList = res.map((course: Course) => ({
          ...course,
          progress: this.calcProgress(course.duration, course.estimatedDuration),
        }))
      } catch (error) {
        console.error('获取课程失败:', error)
        // 如果强制刷新失败，保持空数组而不是恢复旧数据
        if (forceFetch) {
          this.courseList = []
        }
        throw error // 抛出错误以便调用者处理
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取当前课程的所有节点
     * @param courseId 课程 ID
     * @param forceFetch 是否强制刷新
     */
    async getCourseNodes(courseId: number, forceFetch = false) {
      const now = Date.now();

      // 检查缓存是否有效
      if (!forceFetch && this.courseDataCache.has(courseId)) {
        const cached = this.courseDataCache.get(courseId)!;
        if (now - cached.timestamp < this.CACHE_DURATION) {
          // 使用缓存数据
          this.CourseNodes = cached.data;
          this.CourseId = courseId;
          return;
        }
      }

      // 如果课程Id不变且已有数据（且未过期），则不重复请求
      if (!forceFetch && this.CourseId === courseId && this.CourseNodes.length > 0) {
        // 更新缓存时间戳
        this.courseDataCache.set(courseId, {
          data: [...this.CourseNodes],
          timestamp: now
        });
        return;
      }

      this.nodesLoading = true
      try {
        const res = await getCouseNodesApi(courseId)
        console.log('获取到的课程数据为:', res)
        this.CourseNodes = res
        this.CourseId = courseId // 同步当前缓存的 ID

        // 更新缓存
        this.courseDataCache.set(courseId, {
          data: [...res],
          timestamp: now
        });
      } catch (error) {
        console.error(`获取课程 ID 为 ${courseId} 的节点失败:`, error)
        this.CourseNodes = [] // 出错时清空，防止渲染错误数据
      } finally {
        this.nodesLoading = false
      }
    },

    /**
     * 获取并处理图谱数据 (用于可视化界面)
     */
    async getGraphData(courseId: number | string) {
      const id = Number(courseId);

      // 确保完整的课程数据已经加载（利用缓存机制）
      await this.getCourseNodes(id);

      this.nodesLoading = true
      try {
        const res = await getCourseKnowledgeGraphApi(id)

        const rootNode = res[0]
        if (rootNode) {
          this.processGraphData(rootNode)
          this.currentCourseId = id
        }
      } catch (error) {
        console.error('获取图谱数据失败:', error)
      } finally {
        this.nodesLoading = false
      }
    },

    /**
     * 嵌套树转 D3 扁平数据
     */
    processGraphData(root: CourseNode) {
      const nodes: any[] = []
      const links: any[] = []

      const traverse = (node: CourseNode) => {
        const levelNum = parseInt(node.nodeLevel?.replace('LEVEL', '') || '1')

        // 处理 resource 字段：如果是 LEVEL4 且 resource 是数组，取第一个元素
        let processedResource = null;
        if (levelNum === 4 && Array.isArray(node.resource) && node.resource.length > 0) {
          processedResource = node.resource[0];
        } else if (levelNum === 4 && node.resource && !Array.isArray(node.resource)) {
          // 如果已经是对象格式，直接使用
          processedResource = node.resource;
        }

        const newNode = {
          ...node,
          name: node.nodeName,
          level: levelNum,
          resource: processedResource
        }
        nodes.push(newNode)

        if (node.childNodes && node.childNodes.length > 0) {
          node.childNodes.forEach(child => {
            links.push({
              source: node.id,
              target: child.id
            })
            traverse(child)
          })
        }
      }

      traverse(root)
      this.graphData = { nodes, links }
    },

    /**
     * 进度计算工具
     */
    calcProgress(cur: number | undefined, total: number | undefined): number {
      if (!total || total <= 0 || !cur) return 0
      return Math.min(100, Math.round((cur / total) * 100))
    },

    /**
     * 删除课程
     * 从服务器删除课程并从本地列表中移除
     */
    async deleteCourse(courseId: number) {
      try {
        await deleteCourseApi(courseId)
        // 从本地列表中移除已删除的课程
        this.courseList = this.courseList.filter(course => course.id !== courseId)
        // 清除相关缓存
        this.courseDataCache.delete(courseId)
        if (this.CourseId === courseId) {
          this.CourseNodes = []
          this.CourseId = null
        }
        if (this.currentCourseId === courseId) {
          this.currentCourseId = null
          this.graphData = { nodes: [], links: [] }
        }
      } catch (error) {
        console.error('删除课程失败:', error)
        throw error
      }
    }
  }
})
