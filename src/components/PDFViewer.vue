<template>
  <div class="pdf-viewer-section">
    <div
      class="bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-slate-200 shadow-blue-900/5 transition-all duration-500"
    >
      <template v-if="showPreview">
        <div v-if="loading" class="aspect-[4/3] flex items-center justify-center bg-slate-50/50">
          <div class="flex flex-col items-center">
            <div
              class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"
            ></div>
            <p class="text-slate-400 text-sm font-medium">资源获取中，请稍候...</p>
          </div>
        </div>

        <div v-else-if="blobUrl" class="aspect-[4/3] w-full">
          <object :data="blobUrl" type="application/pdf" class="w-full h-full relative z-10">
            <iframe :src="blobUrl" class="w-full h-full" frameborder="0" loading="lazy">
              您的浏览器不支持预览，请尝试下载后查看。
            </iframe>
          </object>
        </div>

        <div
          v-else-if="error"
          class="aspect-[4/3] flex flex-col items-center justify-center bg-slate-50 text-slate-400"
        >
          <PhFilePdf :size="48" weight="thin" class="mb-4 text-red-200" />
          <p class="text-sm">无法加载课件资源，请重试或咨询管理员</p>
          <button
            @click="fetchResource"
            class="mt-4 text-blue-500 text-xs font-bold hover:underline"
          >
            重新加载
          </button>
        </div>
      </template>

      <template v-else>
        <div class="aspect-[4/3] flex flex-col items-center justify-center bg-slate-50/50">
          <div
            class="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"
          >
            <PhFilePdf :size="28" weight="fill" />
          </div>
          <h4 class="text-[16px] font-bold text-slate-700 mb-1">本节配套课件资料</h4>
          <p class="text-[13px] text-slate-400 text-center px-4 max-w-xs">
            点击下方按钮开启在线沉浸式阅读，支持 PDF 格式。
          </p>
        </div>
      </template>

      <div class="p-6 border-t border-slate-200 flex justify-end items-center">
        <button v-if="!showPreview" @click="initPreview" class="action-btn-primary">
          <PhEye :size="16" class="mr-2" /> 在线浏览讲义
        </button>
        <button v-else @click="closePreview" class="action-btn-dark">
          <PhX :size="16" class="mr-2" /> 关闭预览
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue'
import { PhFilePdf, PhX, PhEye } from '@phosphor-icons/vue'
import { getNodeResourceApi } from '@/api/course/course.api'

const props = defineProps({
  nodeId: { type: [Number, String], required: true },
})

const showPreview = ref(false)
const loading = ref(false)
const error = ref(false)
const blobUrl = ref('')

/**
 * 核心：清理 Blob URL 占用的内存
 */
const revokeUrl = () => {
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = ''
  }
}

/**
 * 获取 PDF 资源并转换为内存 Blob
 */
const fetchResource = async () => {
  if (!props.nodeId) return

  loading.value = true
  error.value = false
  revokeUrl()

  try {
    // 1. 调用接口获取预签名地址
    const signedUrlData = await getNodeResourceApi(props.nodeId, 'PDF')
    // 兼容数组或字符串返回
    const downloadUrl = Array.isArray(signedUrlData) ? signedUrlData[0] : signedUrlData

    if (!downloadUrl) throw new Error('Empty URL')

    // 2. 通过 Fetch 获取二进制流，防止浏览器弹出下载
    const response = await fetch(downloadUrl)
    if (!response.ok) throw new Error('Fetch failed')

    const blobData = await response.blob()

    // 3. 转换为内存 URL，显式指定 PDF 类型
    blobUrl.value = URL.createObjectURL(new Blob([blobData], { type: 'application/pdf' }))
  } catch (err) {
    console.error('[PDF Component] Load Error:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

/**
 * 交互：开始预览
 */
const initPreview = () => {
  showPreview.value = true
  fetchResource()
}

/**
 * 交互：关闭预览
 */
const closePreview = () => {
  showPreview.value = false
  revokeUrl()
}

/**
 * 监听 ID 变化：重置状态
 * 严格按照要求：切换时不自动加载，仅重置为待加载状态
 */
watch(
  () => props.nodeId,
  () => {
    showPreview.value = false
    loading.value = false
    error.value = false
    revokeUrl()
  },
)

onBeforeUnmount(() => {
  revokeUrl()
})
</script>

<style scoped>
.action-btn-primary {
  @apply flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95;
}

.action-btn-dark {
  @apply flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95;
}

/* 确保预览区域的容器在转换时有平滑感 */
.pdf-viewer-section {
  perspective: 1000px;
}
</style>
