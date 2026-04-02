import request from '@/request'
import type { Exercise, CreateExerciseDTO, UpdateExerciseDTO } from '@/types/quiz/quiz.type'

/**
 * 获取指定节点的所有习题
 * @param nodeId 节点ID，用于标识课程中的特定节点
 * @returns 返回该节点下的所有习题列表，包含题目内容、选项、分值等完整信息
 */
export const getQuestionsApi = (nodeId: number) => {
  return request<Exercise[]>({
    url: `/api/v1/quiz/exercises/list/${nodeId}`,
    method: 'get',
  })
}

/**
 * 创建新的习题
 * @param data 创建习题所需的数据对象，包含题目内容、选项、答案等信息
 * @returns 返回创建成功的习题对象，包含服务器生成的ID和其他元数据
 */
export const createExerciseApi = (data: CreateExerciseDTO) => {
  return request<Exercise>({
    url: '/api/v1/quiz/exercise',
    method: 'post',
    data
  })
}

/**
 * 更新现有习题
 * @param data 更新习题所需的数据对象，必须包含习题ID
 * @returns 返回更新后的习题对象，包含最新的题目信息
 */
export const updateExerciseApi = (data: UpdateExerciseDTO) => {
  return request<Exercise>({
    url: `/api/v1/quiz/exercise/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 删除指定ID的习题
 * @param id 要删除的习题ID
 * @returns 返回空值，表示删除成功
 */
export const deleteExerciseApi = (id: number) => {
  return request({
    url: `/api/v1/quiz/exercise/${id}`,
    method: 'delete'
  })
}
