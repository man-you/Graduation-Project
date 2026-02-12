import request from '@/request'
import type { Course, CourseNode } from '@/types/course/course.type'

/**
 * 获取所有课程列表
 * 用于课程广场或个人中心
 */
export const getCourseListApi = (): Promise<Course[]> => {
  return request({
    url: '/api/v1/course/list',
    method: 'get',
  })
}

/**
 * 获取课程大纲 (仅结构)
 * 用于课程详情页面的左侧目录或树形列表
 * 对应后端: getCourseOutline
 */
export const getCouseNodesApi = (courseId: number): Promise<CourseNode[]> => {
  return request({
    url: `/api/v1/course/${courseId}`,
    method: 'get',
  })
}

/**
 * 获取课程知识图谱 (完整数据)
 * 用于 D3.js 可视化图谱，包含资源信息及腾讯云签名地址
 * 对应后端: getCourseKnowledgeGraph
 */
export const getCourseKnowledgeGraphApi = (courseId: number): Promise<CourseNode[]> => {
  return request({
    url: `/api/v1/course/graph/${courseId}`,
    method: 'get',
  })
}

/**
 * 获取单个节点的资源签名地址
 * 场景：当图谱中的签名过期，或在详情页点击单个资源时触发
 */
export const getNodeResourceApi = (nodeId: number): Promise<{ signedUrl: string }> => {
  return request({
    url: '/api/v1/tencent-cos/signed-url',
    method: 'get',
    params: { nodeId }
  })
}