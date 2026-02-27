<template>
  <div class="h-screen w-full bg-blue-50 text-slate-700 font-sans flex flex-col">
    <!-- 返回按钮 -->
    <header
      class="h-16 px-6 md:px-10 flex items-center justify-between bg-white border-b border-slate-100 flex-shrink-0"
    >
      <div class="flex items-center gap-4">
        <button
          @click="handleBack"
          class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <PhArrowLeft :size="18" weight="bold" />
        </button>
      </div>
    </header>

    <!-- 复用Chat组件，传入分析模式和nodeId -->
    <div class="flex-1">
      <Chat :mode="'analysis'" :node-id="Number($route.params.nodeId)" />
    </div>
  </div>
</template>

<script setup>
import { routerBack } from '@/util/routerUtil'
import { PhArrowLeft } from '@phosphor-icons/vue'
import Chat from '@/views/public/Chat.vue'
import { onBeforeUnmount } from 'vue'
import { useChatStore } from '@/stores/chat.store'

const handleBack = () => {
  routerBack()
}

// 组件销毁前清理分析数据
const chatStore = useChatStore()
onBeforeUnmount(() => {
  chatStore.clearAnalysisData()
})
</script>

<style scoped>
/* 滚动条隐藏或美化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
