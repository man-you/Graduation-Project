import request from '@/request'
import type { AdminUser, PaginatedUsersResponse,CreateUserRequest,UpdateUserRequest } from '@/types/adminUser.type'

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
export const getUserApi = (id: string): Promise<AdminUser> => {
  return request({
    url: `/api/v1/admin/users/${id}`,
    method: 'get',
  })
}

/**
 * 创建用户
 */
export const createUserApi = (data: CreateUserRequest): Promise<AdminUser> => {
  return request({
    url: '/api/v1/admin/user',
    method: 'post',
    data,
  })
}





/**
 * 更新用户
 */

export const updateUserApi = (id: string, data: UpdateUserRequest): Promise<AdminUser> => {
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

/**
 * 搜索用户
 */
export const searchUserApi = (keyword: string, pageNum: number = 1, pageSize: number = 20):Promise<PaginatedUsersResponse> => {
  return request({
    url: '/api/v1/admin/search/users',
    method: 'get',
    params: {
      keyword,
      pageNum,
      pageSize,
    },
  })
}
