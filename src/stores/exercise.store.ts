import { defineStore } from 'pinia'
import type { Exercise, ExerciseAnswer, SubmitQuizPayload, SubmitResult } from '@/types/course/exercise.type'
import { getExercisesByNodeIdApi, submitExerciseAnswersApi } from '@/api/course/exercise.api'

export const useExerciseStore = defineStore('exercise', {
  state: () => ({
    exercises: [] as Exercise[],
    answers: [] as ExerciseAnswer[], // 存储当前的答案状态
    currentNodeId: null as null | number,
    loading: false,
    submitting: false,
    submitResult: null as null | SubmitResult,
  }),

  actions: {
    async getExercises(nodeId: number) {
      this.loading = true
      try {
        const res = await getExercisesByNodeIdApi(nodeId)
        this.exercises = res
        this.currentNodeId = nodeId
        // 初始化空答案数组
        this.answers = res.map(ex => ({
          exerciseId: ex.id,
          selectedOptionId: null,
          blankAnswer: null
        }))
      } finally {
        this.loading = false
      }
    },

    setAnswer(exerciseId: number, data: Partial<ExerciseAnswer>) {
      const target = this.answers.find(a => a.exerciseId === exerciseId)
      if (target) {
        Object.assign(target, data)
      }
    },

    async submitAnswers() {
      if (this.submitting || !this.currentNodeId) return
      this.submitting = true
      
      try {
        const payload: SubmitQuizPayload = {
          nodeId: this.currentNodeId,
          answers: this.answers
        }
        const result = await submitExerciseAnswersApi(payload)
        this.submitResult = result
        return result
      } finally {
        this.submitting = false
      }
    },

    reset() {
      this.$reset()
    }
  }
})