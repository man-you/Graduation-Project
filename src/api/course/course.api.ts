import request from '@/request'
import type { Course,CourseNode } from '@/types/course/course.type'

export const getCourseListApi = (): Promise<Course[]> => {
  return request({
    url: '/api/v1/course/list',
    method: 'get',
  })
}

export const getCouseNodesApi = (courseId:number):Promise<CourseNode[]>=>{
  return request({
    url:`/api/v1/course/${courseId}`,
    method:'get'
  })
}

export const getNodeResourceApi = (nodeId:number):Promise<any>=>{
  return request({
    url:'/api/v1/tencent-cos/signed-url',
    method:'get',
    params:{nodeId}
  })
}
