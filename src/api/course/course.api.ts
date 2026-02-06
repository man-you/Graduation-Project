import request from '@/request'
import type { Course } from '@/types/course/course.type'

export const getCourseListApi = (): Promise<Course[]> => {
  return request({
    url: '/api/v1/course/list',
    method: 'get',
  })
}
