export type ChatRole = 'user' | 'assistant' | 'system'

export interface ChatMessage {
  id?: number

  role: ChatRole

  content: string

  streaming?: boolean

  pending?: boolean

  error?: boolean

  createdAt?: string
}

// 分页器
export interface Pagination {
  pageNum: number
  pageSize: number
  total: number
  hasMore: boolean
}
