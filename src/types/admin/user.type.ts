export type UserRole = 'student' | 'teacher' | 'admin' 

/**
 * 单个用户
 */
export interface User {
  id: string;
  email: string;
  userName: string;
  identifier: string;
  role: UserRole;
  phoneNumber: string;
  grade: string;
}

/**
 * 分页获取用户列表
 */
export interface PaginatedUsersResponse {
  users: User[];
  pageNum: number;
  pageSize: number;
  total: number;
}


// 创建用户请求体
export interface CreateUserRequest {
  userName?: string
  email: string
  identifier: string
  phoneNumber: string
  password: string
  role?: UserRole
}

// 更新用户请求体（部分字段可选）
export interface UpdateUserRequest {
  userName?: string
  email?: string
  phoneNumber?: string
  password?: string
  role?: UserRole
}