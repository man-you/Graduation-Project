import { defineStore } from 'pinia'
import type { ChatMessage, Pagination } from '../types/chat/chat.type'
import { getToken } from '../util/authUtil'
import {
  getMessageListApi,
  getConversationListApi,
  deleteConversationApi,
} from '../api/chat/chat.api'

interface ChatState {
  conversationId: number | null
  messages: ChatMessage[]
  historyList: any[] // 存储对话历史列表
  loading: boolean
  historyLoading: boolean // 对话列表专用加载状态
  abortController: AbortController | null
  sseBuffer: string
  pagination: Pagination // 消息列表分页
  historyPagination: Pagination // 对话列表分页 (新增)
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    conversationId: null,
    messages: [],
    historyList: [],
    loading: false,
    historyLoading: false,
    abortController: null,
    sseBuffer: '',
    // 聊天消息的分页：默认 pageNum=1, pageSize=10
    pagination: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      hasMore: true,
    },
    // 对话列表的分页：默认 pageNum=1, pageSize=10
    historyPagination: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      hasMore: true,
    },
  }),

  actions: {
    resetConversation() {
      this.conversationId = null
      this.messages = []
      this.loading = false
      this.sseBuffer = ''
      this.abortController?.abort()
      this.abortController = null
    },

    async sendMessage(prompt: string) {
      if (this.loading) return

      this.loading = true
      this.sseBuffer = ''

      // 1. 推入用户消息
      this.messages.push({
        role: 'user',
        content: prompt,
        createdAt: new Date().toLocaleTimeString(),
      })

      // 2. 推入助手占位消息
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: '思考中...',
        streaming: true,
        pending: true,
        createdAt: new Date().toLocaleTimeString(),
      }
      this.messages.push(assistantMessage)

      // 获取当前助手的索引，方便后续精确修改
      const assistantIndex = this.messages.length - 1

      this.abortController?.abort()
      this.abortController = new AbortController()

      try {
        const token = getToken()
        const response = await fetch('/api/v1/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            conversationId: this.conversationId,
            userInput: prompt,
          }),
          signal: this.abortController.signal,
        })

        if (!response.body) throw new Error('No response body')

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          this.consumeChunk(chunk, assistantIndex)
        }
      } catch (err) {
        console.error('[ChatStore] Error:', err)
        const msg = this.messages[assistantIndex]
        if (msg) {
          msg.content = '请求失败: ' + (err as Error).message
        }
      } finally {
        const msg = this.messages[assistantIndex]
        if (msg) {
          msg.streaming = false
          msg.pending = false
        }
        this.loading = false
        this.abortController = null
      }
    },

    consumeChunk(chunk: string, index: number) {
      this.sseBuffer += chunk
      const events = this.sseBuffer.split('\n\n')
      this.sseBuffer = events.pop() || ''

      for (const rawEvent of events) {
        this.handleEvent(rawEvent, index)
      }
    },

    handleEvent(eventText: string, index: number) {
      const lines = eventText.split('\n')
      let event = ''
      let data = ''

      for (const line of lines) {
        if (line.startsWith('event:')) event = line.replace('event:', '').trim()
        else if (line.startsWith('data:')) data += line.replace('data:', '').trim()
      }

      let payload
      try {
        payload = JSON.parse(data)
      } catch {
        payload = data
      }

      const msg = this.messages[index]

      if (!msg) return

      switch (event) {
        case 'meta':
          this.conversationId = payload.conversationId
          break
        case 'message':
          if (msg.pending) {
            msg.content = ''
            msg.pending = false
          }
          // 直接修改 state 里的对象属性，Vue 能监听到
          msg.content += payload
          break
        case 'error':
          msg.content = payload.message || '出错了'
          msg.streaming = false
          this.loading = false
          break
        case 'done':
          msg.streaming = false
          this.loading = false
          if (this.messages.length <= 2 && this.conversationId !== null) {
            this.loadConversationList(false)
          }
          break
      }
    },

    /**
     * 加载对话与消息列表
     * @param id
     */

    // --- 会话逻辑 (Conversations) 逻辑 ---

    // 获取对话列表
    async loadConversationList(isLoadMore = false) {
      if (this.historyLoading || (isLoadMore && !this.historyPagination.hasMore)) return

      this.historyLoading = true

      if (!isLoadMore) {
        this.historyPagination.pageNum = 1
        this.historyPagination.hasMore = true
      }

      try {
        const res = await getConversationListApi({
          pageNum: this.historyPagination.pageNum,
          pageSize: this.historyPagination.pageSize,
        })

        // 此时 res 已经是拦截器处理后的 res.data
        if (res && res.conversations) {
          const formattedConversations = res.conversations.map((conv: any) => ({
            ...conv,
            createdAt: conv.createdAt
              ? new Date(conv.createdAt).toLocaleDateString()
              : conv.createdAt,
          }))

          if (isLoadMore) {
            this.historyList = [...this.historyList, ...formattedConversations]
          } else {
            this.historyList = formattedConversations
          }

          if (res.pagination) {
            this.historyPagination.total = res.pagination.total
            this.historyPagination.hasMore = this.historyList.length < this.historyPagination.total
          }
        }
      } catch (err) {
        console.error('获取历史列表失败:', err)
      } finally {
        this.historyLoading = false
      }
    },

    // 删除会话
    async deleteConversation(id: number) {
      try {
        // 1. 调用接口执行物理删除
        await deleteConversationApi(id)

        // 2. 从本地 historyList 列表中移除（响应式更新侧边栏）
        this.historyList = this.historyList.filter((conv) => conv.id !== id)

        // 3. 更新总数记录
        if (this.historyPagination.total > 0) {
          this.historyPagination.total--
        }

        // 4. 重要逻辑：如果删除的是当前正在看的会话
        if (this.conversationId === id) {
          this.resetConversation() // 重置聊天框状态（清空消息、ID置null）
        }

        // 5. 体验优化：如果列表删空了，可以自动触发加载下一页，或者根据需要处理
        if (this.historyList.length === 0 && this.historyPagination.hasMore) {
          this.loadConversationList(false)
        }

        return true
      } catch (err) {
        console.error('删除会话失败:', err)
        throw err // 抛出错误让 UI 层捕获并弹窗提醒
      }
    },
    // 对话翻页
    async loadNextHistoryPage() {
      if (!this.historyPagination.hasMore || this.historyLoading) return
      this.historyPagination.pageNum++
      await this.loadConversationList(true)
    },

    // --- 聊天消息 (Messages) 逻辑 ---

    // 选中会话加载消息
    async loadConversation(id: number) {
      this.conversationId = id
      this.messages = []
      this.pagination.pageNum = 1
      this.pagination.hasMore = true
      await this.loadMessages(false)
    },

    // 请求消息数据
    async loadMessages(isLoadMore = false) {
      if (this.loading || (!this.pagination.hasMore && isLoadMore) || !this.conversationId) return

      this.loading = true

      try {
        const res = await getMessageListApi({
          conversationId: this.conversationId,
          pageNum: this.pagination.pageNum,
          pageSize: this.pagination.pageSize,
        })

        if (res && res.messages) {
          const remoteMessages = res.messages.map((m: any) => ({
            ...m,
            streaming: false,
            pending: false,
            createdAt: new Date(m.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }))

          if (isLoadMore) {
            this.messages = [...remoteMessages, ...this.messages]
          } else {
            this.messages = [...remoteMessages]
          }

          // 更新分页状态
          if (res.pagination) {
            this.pagination.total = res.pagination.total
            this.pagination.hasMore = this.messages.length < this.pagination.total
          }
        }
      } catch (err) {
        console.error('加载消息失败:', (err as Error).message)
      } finally {
        this.loading = false
      }
    },

    // 加载下一页
    async loadNextPage() {
      if (!this.pagination.hasMore || this.loading) return
      this.pagination.pageNum++
      await this.loadMessages(true)
    },

    // 启动分析模式
    async startAnalysisMode(nodeId: number) {
      // 重置当前对话状态
      this.resetConversation()
      
      try {
        // 调用后端分析接口，传入分析数据和模式参数
        const token = getToken()
        const response = await fetch('/api/v1/chat/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            mode: 'analysis', // 指定分析模式
            nodeId: nodeId,
            conversationId: null, // 分析模式不需要conversationId
            userInput: '' // 分析模式不需要用户输入
          }),
        })

        if (!response.body) throw new Error('No response body')

        // 创建助手占位消息
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: '正在生成分析报告...',
          streaming: true,
          pending: true,
          createdAt: new Date().toLocaleTimeString(),
        }
        this.messages.push(assistantMessage)
        const assistantIndex = this.messages.length - 1

        const reader = response.body.getReader()
        const decoder = new TextDecoder()

        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          this.consumeChunk(chunk, assistantIndex)
        }
      } catch (err) {
        console.error('[ChatStore] Analysis error:', err)
        // 添加错误消息
        this.messages.push({
          role: 'assistant',
          content: '生成分析报告时出现错误，请稍后重试。',
          createdAt: new Date().toLocaleTimeString(),
        })
      }
    },

    // 清理分析模式数据
    clearAnalysisData() {
      // 只有在非聊天模式（即分析模式）下才清理数据
      if (this.conversationId === null && this.messages.length > 0) {
        this.messages = []
        this.loading = false
        this.sseBuffer = ''
        this.abortController?.abort()
        this.abortController = null
      }
    },
  },
})
