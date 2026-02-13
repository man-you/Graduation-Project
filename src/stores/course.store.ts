import { defineStore } from 'pinia'
import type { Course, CourseNode } from '@/types/course/course.type'
import { 
  getCourseListApi, 
  getCourseKnowledgeGraphApi, 
  getCouseNodesApi // 确保 API 已导入
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
  }),

  actions: {
    /**
     * 课程列表获取
     */
    async getCourseList() {
      if (this.courseList.length > 0) return
      this.loading = true
      try {
        const res = await getCourseListApi()
        this.courseList = res.map((course: Course) => ({
          ...course,
          progress: this.calcProgress(course.duration, course.estimatedDuration),
        }))
      } catch (error) {
        console.error('获取课程失败:', error)
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
      // 如果课程Id不变且已有数据，则不重复请求
      
      if (!forceFetch && this.CourseId === courseId && this.CourseNodes.length > 0) return

      this.nodesLoading = true
      try {
        const res = await getCouseNodesApi(courseId)
        console.log('获取到的课程数据为:', res)
        this.CourseNodes = res
        this.CourseId = courseId // 同步当前缓存的 ID
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
        const newNode = {
          ...node,
          name: node.nodeName,
          level: levelNum,
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
    }
  }
})