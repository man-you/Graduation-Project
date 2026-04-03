import request from '@/request'
export const getMessageListApi = (params: {
  conversationId: number
  pageNum?: number
  pageSize?: number
}): Promise<any> => {
  return request({
    url: '/api/v1/chat/conversation',
    method: 'get',
    params,
  })
}

export const getConversationListApi = (params: {
  pageNum?: number
  pageSize?: number
}): Promise<any> => {
  return request({
    url: '/api/v1/chat/conversations',
    method: 'get',
    params,
  })
}

export const deleteConversationApi = (id: number): Promise<void> => {
  return request({
    url: `/api/v1/chat/delete/${id}`,
    method: 'delete',
  })
}
