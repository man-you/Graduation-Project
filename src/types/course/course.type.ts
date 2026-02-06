/**
 * 课程类型

 */

export interface Course {
  id: number
  title: string
  description: string
  estimatedDuration: number
  duration: number
  isCompleted: boolean
  progress?: number
}
