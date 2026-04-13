import { defineStore } from 'pinia'
import type { AdminUser,  CreateUserRequest, UpdateUserRequest } from '@/types/adminUser.type'
import {
  getUserListApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  searchUserApi
} from '@/api/admin.api'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    // 用户列表
    users: [] as AdminUser[],
    // 分页信息
    pagination: {
      pageNum: 1,
      pageSize: 10,
      total: 0
    },
    // 加载状态
    loading: false,
    // 搜索关键词
    searchQuery: ''
  }),

  actions: {
    /**
     * 获取用户列表
     */
    async getUserList(pageNum: number = 1) {
      this.loading = true
      try {
        const params = {
          pageNum,
          pageSize: this.pagination.pageSize
        }
        const res = await getUserListApi(params)
        this.users = res.users
        this.pagination = {
          pageNum: res.pageNum,
          pageSize: res.pageSize,
          total: res.total
        }
      } catch (error) {
        console.error('获取用户列表失败:', error)
      } finally {
        this.loading = false
      }
    },

    /**
     * 创建用户
     */
    async createUser(data: CreateUserRequest) {
      try {
        console.log('createUserApi', data)
        const user = await createUserApi(data)
        // 刷新用户列表
        await this.getUserList(this.pagination.pageNum)
        return user
      } catch (error) {
        console.error('创建用户失败:', error)
        throw error
      }
    },

    /**
     * 更新用户
     */
    async updateUser(id: string, data: UpdateUserRequest) {
      try {
        const user = await updateUserApi(id, data)
        // 刷新用户列表
        await this.getUserList(this.pagination.pageNum)
        return user
      } catch (error) {
        console.error('更新用户失败:', error)
        throw error
      }
    },

    /**
     * 删除用户
     */
    async deleteUser(id: string) {
      try {
        await deleteUserApi(id)
        // 刷新用户列表
        await this.getUserList(this.pagination.pageNum)
      } catch (error) {
        console.error('删除用户失败:', error)
        throw error
      }
    },

    /**
     * 搜索用户
     */
    async searchUsers(keyword: string) {
      try {
        const res = await searchUserApi(keyword)
        this.users = res.users
        this.pagination.total = res.total
      } catch (error) {
        console.error('搜索用户失败:', error)
      }
    }
  }
})
