import request from '@/request'
import type { User, PaginatedUsersResponse,CreateUserRequest,UpdateUserRequest } from '@/types/admin/user.type'

export const getUserListApi = (params: {
  pageNum?: number
  pageSize?: number
}): Promise<PaginatedUsersResponse> => {
  return request({
    url: '/api/v1/admin/users',
    method: 'get',
    params,
  })
}

/**
 * 获取单个用户
 */
export const getUserApi = (id: string): Promise<User> => {
  return request({
    url: `/api/v1/admin/users/${id}`,
    method: 'get',
  })
}

/**
 * 创建用户
 */
export const createUserApi = (data: CreateUserRequest): Promise<User> => {
  return request({
    url: '/api/v1/admin/users',
    method: 'post',
    data,
  })
}





/**
 * 更新用户
 */

export const updateUserApi = (id: string, data: UpdateUserRequest): Promise<User> => {
  return request({
    url: `/api/v1/admin/users/${id}`,
    method: 'patch',
    data,
  })
}


/**
 * 删除用户
 */
export const deleteUserApi = (id: string): Promise<void> => {
  return request({
    url: `/api/v1/admin/users/${id}`,
    method: 'delete',
  })
}