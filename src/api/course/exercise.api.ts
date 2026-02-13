import request from '@/request'
import type { Exercise, SubmitQuizPayload, SubmitResult } from '@/types/course/exercise.type'

/**
 * 获取指定节点的习题列表
 */
export const getExercisesByNodeIdApi = (nodeId: number): Promise<Exercise[]> => {
  return request({
    url: `/api/v1/quiz/${nodeId}`,
    method: 'get',
  })
}

/**
 * 提交习题答案
 * 对应后端 @Post('submit')
 */
export const submitExerciseAnswersApi = (payload: SubmitQuizPayload): Promise<SubmitResult> => {
  return request({
    url: '/api/v1/quiz/submit',
    method: 'post',
    data: payload
  })
}