import { defineStore } from 'pinia'
import {
  getQuestionsApi,
  createExerciseApi,
  updateExerciseApi,
  deleteExerciseApi
} from '@/api/quiz.api'
import type { Exercise, CreateExerciseDTO, UpdateExerciseDTO } from '@/types/quiz.type'

interface QuizState {
  exercises: Exercise[]
  loading: boolean
  currentNodeId: number | null
}

export const useQuizStore = defineStore('quiz', {
  state: (): QuizState => ({
    exercises: [],
    loading: false,
    currentNodeId: null,
  }),

  getters: {
    hasExercises: (state) => state.exercises.length > 0,
  },

  actions: {
    /**
     * 获取指定节点的习题
     * 直接处理 response 为数组的情况
     */
    async getExercises(nodeId: number) {
      this.loading = true
      try {
        const response = await getQuestionsApi(nodeId)
        const data = Array.isArray(response) ? response : []

        this.exercises = data.map((ex: any) => ({
          ...ex,
          // 容错处理：确保 options 是数组且 isCorrect 是布尔值
          options: Array.isArray(ex.options)
            ? ex.options.map((opt: any) => ({ ...opt, isCorrect: !!opt.isCorrect }))
            : []
        }))
        this.currentNodeId = nodeId
      } catch (error) {
        console.error('[Quiz Store] Fetch Error:', error)
        this.exercises = []
      } finally {
        this.loading = false
      }
    },

    /**
     * 创建习题
     * 直接使用返回的 response 对象更新列表
     */
    async createExercise(payload: CreateExerciseDTO) {
      this.loading = true
      try {
        const response = await createExerciseApi(payload)
        const newExercise = response as unknown as Exercise

        // 确保新数据进入列表前结构完整
        if (newExercise.options) {
          newExercise.options = newExercise.options.map((o: any) => ({ ...o, isCorrect: !!o.isCorrect }))
        }

        this.exercises.push(newExercise)
        return newExercise
      } catch (error) {
        console.error('[Quiz Store] Create Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 更新习题
     * 使用返回的最新对象替换旧对象
     */
    async updateExercise(payload: UpdateExerciseDTO) {
      this.loading = true
      try {
        const response = await updateExerciseApi(payload)
        const updatedExercise = response as unknown as Exercise

        const index = this.exercises.findIndex(ex => ex.id === updatedExercise.id || ex.id === payload.id)
        if (index !== -1) {
          // 合并现有数据和返回的数据，防止后端返回字段不全
          this.exercises[index] = {
            ...this.exercises[index],
            ...updatedExercise,
            options: Array.isArray(updatedExercise.options)
              ? updatedExercise.options.map((o: any) => ({ ...o, isCorrect: !!o.isCorrect }))
              : (this.exercises[index]?.options ?? [])
          }
        }
      } catch (error) {
        console.error('[Quiz Store] Update Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 删除习题
     */
    async deleteExercise(id: number) {
      this.loading = true
      try {
        await deleteExerciseApi(id)
        this.exercises = this.exercises.filter(ex => ex.id !== id)
      } catch (error) {
        console.error('[Quiz Store] Delete Error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * 重置状态
     */
    reset() {
      this.exercises = []
      this.currentNodeId = null
      this.loading = false
    }
  }
})
