import { defineStore } from 'pinia'
import type { Course } from '@/types/course/course.type'
import { getCourseListApi } from '@/api/course/course.api'

export const useCourseStore = defineStore('course', {
  state: () => ({
    courseList: [] as Course[],
    loading: false,
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

    // 获取当前课程的所有节点
  },
})
