import { defineStore } from 'pinia'
import { getPPTTemplates, createPPT, getPPTProgress } from '@/api/ppt.api'
import type { PPTTemplate, PPTTemplateList, CreatePPTRequest, PPTProgressResponse } from '@/types/ppt.type'
import { setPPTSID, getPPTSID, removePPTSID } from '@/util/storageUtil'

// 最大重试次数常量
const MAX_RETRY_COUNT = 10

interface PPTState {
  templates: PPTTemplate[]
  total: number
  loading: boolean
  // PPT生成相关状态
  generating: boolean
  currentSid: string | null
  progress: number
  pptUrl: string | null
  generationError: string | null
  pollingTimer: number | null
  retryCount: number
}

export const usePPTStore = defineStore('ppt', {
  state: (): PPTState => ({
    templates: [],
    total: 0,
    loading: false,
    currentSid: getPPTSID(), // 初始化时直接从本地恢复
    generating: !!getPPTSID(),
    progress: 0,
    pptUrl: null,
    generationError: null,
    pollingTimer: null,
    retryCount: 0,
  }),

   getters: {

    hasTemplates: (state) => state.templates.length > 0,

    getTemplateImage: () => (template: PPTTemplate): string => {

      if (!template.detailImage) return ''

      try {

        const detail = typeof template.detailImage === 'string'

          ? JSON.parse(template.detailImage)

          : template.detailImage

        return detail.titleCoverImage || detail.titleCoverImageLarge || ''

      } catch (error) {

        return ''

      }

    },

    isGenerating: (state) => state.generating,

    hasPPTUrl: (state) => !!state.pptUrl,

  },

  actions: {
    /**
     * 加载 PPT 模板列表
     */
     async loadTemplates() {

      if (this.loading) return

      this.loading = true

      try {

        const response: PPTTemplateList = await getPPTTemplates()

        if (response.flag && response.data) {

          this.templates = response.data.records || []

          this.total = response.data.total || 0

        }

      } catch (error) {

        console.error('Pinia: 加载PPT模板失败', error)

      } finally {

        this.loading = false

      }

    },
    /**
     * 创建 PPT 任务
     */
    async createPPT(createData: CreatePPTRequest) {
      this.resetGeneration()
      this.generating = true

      try {
        const response = await createPPT(createData)

        console.log('PPT任务启动成功：', response)


        if (response?.sid) {
          this.currentSid = response.sid
          setPPTSID(response.sid)
          this.pollPPTProgress()
        } else {
          throw new Error('未获取到有效的任务会话ID')
        }
      } catch (error: any) {
        this.generating = false
        this.generationError = error.message || '启动任务失败'
        removePPTSID()
      }
    },

    /**
     * 核心轮询逻辑：具备极强容错性
     */
    async pollPPTProgress() {
      if (!this.currentSid) return

      try {
        const response: PPTProgressResponse = await getPPTProgress(this.currentSid)


        console.log('PPT进度更新：', response.data)

        // 1. 处理业务逻辑错误（后端返回 flag 为 false 或无数据）
        if (!response) {
          this.scheduleNextPoll()
          return
        }

        console.log('PPT进度更新：', response.data)

        const { pptStatus, pptUrl, errMsg, totalPages, donePages } = response.data
        this.retryCount = 0 // 请求成功，重置网络重试计数

        // 更新进度
        this.progress = totalPages > 0
          ? Math.min(Math.round((donePages / totalPages) * 100), 99)
          : 0

        switch (pptStatus) {
          case 'done':
            this.progress = 100
            this.pptUrl = pptUrl || null
            this.generating = false
            removePPTSID() // 任务完成，清除持久化
            break
          case 'build_failed':
            this.generating = false
            this.generationError = errMsg || '生成失败'
            removePPTSID() // 任务失败，清除持久化
            break
          default:
            this.scheduleNextPoll()
            break
        }
      } catch (error) {
        // 2. 处理网络层错误（断网、502、超时等）
        this.retryCount++
        console.warn(`网络异常，正在进行第 ${this.retryCount} 次重试...`)

        // 检查是否达到最大重试次数
        if (this.retryCount >= MAX_RETRY_COUNT) {
          this.generating = false
          this.generationError = '网络连接异常，已达到最大重试次数'
          if (this.pollingTimer) clearTimeout(this.pollingTimer)
          this.pollingTimer = null
          this.currentSid = null
          removePPTSID()
          return
        }

        // 指数退避：重试间隔随次数增加，最大 5 秒
        const delay = Math.min(2000 + this.retryCount * 1000, 5000)
        this.scheduleNextPoll(delay)
      }
    },

    scheduleNextPoll(delay = 2000) {
      if (this.pollingTimer) clearTimeout(this.pollingTimer)
      if (this.currentSid) {
        this.pollingTimer = window.setTimeout(() => this.pollPPTProgress(), delay)
      }
    },

    cancelGeneration() {
      if (this.pollingTimer) clearTimeout(this.pollingTimer)
      this.pollingTimer = null
      this.generating = false
      this.currentSid = null
      this.progress = 0
      removePPTSID()
    },

    cleanupOnUnmount() {
      if (this.pollingTimer) {
        clearTimeout(this.pollingTimer)
        this.pollingTimer = null
      }
    },

    resetGeneration() {
      this.cancelGeneration()
      this.pptUrl = null
      this.generationError = null
    }
  }
})
