<template>
  <div class="space-y-3">
    <label class="block text-sm font-semibold text-slate-700 flex items-center gap-2">
      <PhFilePdf :size="18" class="text-red-500" />
      {{ label }}
    </label>

    <div
      v-if="modelValue"
      class="group relative flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl"
    >
      <div class="flex items-center gap-3 flex-1 min-w-0">
        <div class="p-2 bg-red-50 text-red-600 rounded-lg shrink-0">
          <PhFilePdf :size="24" />
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-medium text-slate-800 truncate" :title="fileName || ''">
            {{ fileName || '未知文件名' }}
          </span>
          <span class="text-xs text-slate-500">已存至云端</span>
        </div>
      </div>
    </div>

    <div v-else>
      <label
        class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer"
        :class="{ 'opacity-70 cursor-not-allowed': uploading }"
      >
        <template v-if="!uploading">
          <PhCloudArrowUp :size="24" class="text-blue-600" />
          <p class="mt-2 text-sm text-slate-600">点击或拖拽上传 PDF</p>
        </template>

        <template v-else>
          <PhSpinner class="animate-spin text-blue-600" :size="24" />
          <p class="mt-2 text-sm text-blue-600">正在上传云端...</p>
        </template>

        <input
          type="file"
          class="hidden"
          accept=".pdf"
          :disabled="uploading"
          @change="handleUpload"
        />
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { bindResourceApi } from '@/api/file.api'
import type { FileType, BindResourceDto } from '@/types/file.type'

// --- Props & Emits ---
const props = defineProps<{
  nodeId: number
  modelValue: string | null // 存储 resourcePath
  fileName: string | null // 存储 resourceName
  resourceId?: number // 数据库记录 ID
  label?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:fileName': [value: string]
  'update:resourceId': [value: number]
  error: [msg: string]
  success: [msg: string]
}>()

// --- State ---
const uploading = ref(false)

// --- Logic ---

/**
 * 处理文件上传逻辑
 * 流程：后端备案 -> 获取预签名 URL -> 腾讯云 COS 直传 -> 更新状态
 */
const handleUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || uploading.value) return

  uploading.value = true

  try {
    // 1. 准备备案数据并获取上传凭证
    const payload: BindResourceDto = {
      resourceName: file.name,
      nodeId: props.nodeId,
      resourceType: 'PDF' as FileType,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      fileFormat: 'PDF',
    }

    const { uploadUrl, resourcePath, id } = await bindResourceApi(payload)

    // 2. 腾讯云 COS 直传 (保持 Content-Type 一致性)
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type || 'application/pdf' },
    })

    // 3. 批量分发状态更新
    emit('update:modelValue', resourcePath)
    emit('update:fileName', file.name)
    emit('update:resourceId', id)
    emit('success', '上传成功')
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || '上传过程中发生异常'
    console.error('[Upload Error]:', err)
    emit('error', errorMsg)
  } finally {
    uploading.value = false
    target.value = ''
  }
}
</script>
