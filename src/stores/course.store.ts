import { defineStore } from 'pinia'
import type { Course, CourseNode} from '@/types/course/course.type'
import { getCourseListApi,getCouseNodesApi } from '@/api/course/course.api'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courseList: [] as Course[],
    CourseNodes: [] as CourseNode[],
    CourseId:null as null | number,
    loading: false,
    nodesLoading: false,

  }),

  actions: {
    async getCourseList() {
      // 避免重复请求：如果已有数据则不重复加载（可选）
      if (this.courseList.length > 0) return

      this.loading = true
      try {
        const res = await getCourseListApi()
        // 直接在 state 上进行 map 操作
        this.courseList = res.map((course: Course) => ({
          ...course,
          // 确保字段存在，并计算进度
          progress: this.calcProgress(course.duration, course.estimatedDuration),
        }))
      } catch (error) {
        console.error('获取课程失败:', error)
      } finally {
        this.loading = false
      }
    },

    calcProgress(cur: number, total: number): number {
      if (!total || total <= 0) return 0
      return Math.min(100, Math.round((cur / total) * 100))
    },

    /**
     * 获取当前课程的所有节点
     * @param courseId 课程 ID
     * @param forceFetch 是否强制刷新
     */
    async getCourseNodes(courseId:number,forceFetch = false){
      // 如果课程Id不变且已有数据，则不重复请求
      if(!forceFetch && this.CourseId === courseId && this.CourseNodes.length > 0) return

      this.nodesLoading = true


      try{
        const res =  await getCouseNodesApi(courseId)
        this.CourseNodes = res
      }catch(error){
        console.error(`获取课程 ID 为 ${courseId} 的节点失败:`, error)
        this.CourseNodes = [] // 出错时清空，防止渲染错误数据
      } finally {
        this.nodesLoading = false
      }
    },

    /**
     * 重置节点状态（切换课程时手动调用或由 action 自动处理）
     */
    resetCourseNodes() {
      this.CourseNodes = []
      this.CourseId = null
    }
  },
})
