<template>
  <div class="pdf-viewer-section">
    <div
      class="bg-white rounded-[2rem] shadow-2xl overflow-hidden relative border border-slate-200 shadow-blue-900/5 transition-all duration-500"
    >
      <!-- 预览状态 -->
      <template v-if="showPreview">
        <div v-if="loading" class="aspect-[4/3] flex items-center justify-center bg-slate-50/50">
          <div class="flex flex-col items-center">
            <div
              class="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"
            ></div>
            <p class="text-slate-400 text-sm font-medium">资源加载中，请稍候...</p>
          </div>
        </div>

        <div v-if="blobUrl" class="aspect-[4/3] w-full">
          <object :data="blobUrl" type="application/pdf" class="w-full h-full relative z-10">
            <iframe :src="blobUrl" class="w-full h-full" frameborder="0">
              您的浏览器不支持预览，请点击下载查看。
            </iframe>
          </object>
        </div>

        <div
          v-else-if="!loading && error"
          class="aspect-[4/3] flex flex-col items-center justify-center bg-slate-50 text-slate-400"
        >
          <PhFilePdf :size="48" weight="thin" class="mb-4 text-red-200" />
          <p class="text-sm">无法加载课件资源，请重试或联系管理员</p>
        </div>
      </template>

      <!-- 未预览状态 -->
      <template v-else>
        <div class="aspect-[4/3] flex flex-col items-center justify-center bg-slate-50/50">
          <div
            class="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4"
          >
            <PhFilePdf :size="28" weight="fill" />
          </div>
          <h4 class="text-[16px] font-bold text-slate-700 mb-1">本节配套课件资料</h4>
          <p class="text-[13px] text-slate-400 text-center px-4">
            支持 PDF 在线沉浸式阅读，掌握核心知识点
          </p>
        </div>
      </template>

      <!-- 统一的底部按钮区域 -->
      <div class="p-6 border-t border-slate-200 flex justify-between items-center">
        <button
          v-if="!showPreview"
          @click="initPreview"
          class="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-all shadow-md"
        >
          <PhEye :size="16" class="mr-2" /> 在线浏览
        </button>
        <button
          v-else
          @click="closePreview"
          class="flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-lg transition-all shadow-md"
        >
          <PhX :size="16" class="mr-2" /> 关闭预览
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch } from 'vue'
import { PhFilePdf, PhX, PhDownloadSimple, PhEye } from '@phosphor-icons/vue'
import { getNodeResourceApi } from '@/api/course/course.api'

const props = defineProps({
  nodeId: { type: Number, required: true },
})

const showPreview = ref(false)
const loading = ref(false)
const error = ref(false)
const blobUrl = ref('')
const originalUrl = ref('')

// 点击“在线浏览”：开始获取资源并转换
const initPreview = async () => {
  showPreview.value = true
  await fetchResource()
}

const closePreview = () => {
  showPreview.value = false
}

const fetchResource = async () => {
  if (!props.nodeId) return

  loading.value = true
  error.value = false

  // 清理上一次的内存占用
  if (blobUrl.value) {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = ''
  }

  try {
    // 1. 获取预签名 URL
    const signedUrl = await getNodeResourceApi(props.nodeId)

    originalUrl.value = signedUrl[0]

    // 2. 核心：通过 fetch 获取 Blob，强制浏览器在内存处理数据而非跳转下载
    const response = await fetch(signedUrl)
    if (!response.ok) throw new Error('Network response was not ok')

    const blob = await response.blob()
    // 3. 创建本地 Blob 链接
    blobUrl.value = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
  } catch (err) {
    console.error('PDF Load Error:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// 监听 ID 变化：如果用户在预览态切换了章节，自动加载新 PDF
watch(
  () => props.nodeId,
  (newId) => {
    if (showPreview.value && newId) {
      fetchResource()
    }
  },
)

onBeforeUnmount(() => {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
})
</script>
