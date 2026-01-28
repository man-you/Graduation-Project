<template>
  <div
    class="chat-desktop-wrapper h-screen w-full bg-[#f8f9fc] dark:bg-[#06080f] text-slate-900 dark:text-slate-100 flex overflow-hidden font-sans"
  >
    <aside
      class="w-16 flex-none bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 z-30"
    >
      <div
        class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-8 cursor-pointer hover:bg-indigo-700 transition-colors"
        @click="chatStore.resetConversation()"
        title="开启新对话"
      >
        <PhGraph size="24" weight="fill" />
      </div>
      <button
        @click="showHistory = !showHistory"
        :class="[
          'p-2.5 rounded-xl transition-all',
          showHistory ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'text-slate-400',
        ]"
      >
        <PhClockCounterClockwise size="24" weight="duotone" />
      </button>
    </aside>

    <Transition name="drawer">
      <div
        v-if="showHistory"
        class="w-64 flex-none bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-30"
      >
        <div
          class="p-4 font-bold border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"
        >
          <span>历史对话</span>
          <button
            @click="chatStore.resetConversation()"
            class="text-indigo-600 hover:text-indigo-700 transition-colors"
            title="新建对话"
          >
            <PhPlusCircle size="22" weight="fill" />
          </button>
        </div>

        <div
          class="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1"
          @scroll="handleHistoryScroll"
        >
          <div
            v-if="!chatStore.historyLoading && chatStore.historyList.length === 0"
            class="py-10 text-center text-slate-400 text-xs"
          >
            暂无历史记录
          </div>

          <div
            v-for="chat in chatStore.historyList"
            :key="chat.id"
            @click="handleSelectChat(chat.id)"
            :class="[
              'group relative p-3 rounded-xl cursor-pointer transition-all border duration-200',
              chatStore.conversationId === chat.id
                ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-600'
                : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300',
            ]"
          >
            <div class="pr-8">
              <div class="font-medium text-[13px] truncate leading-tight">
                {{ chat.title || '新对话' }}
              </div>
              <div class="text-[10px] text-slate-400 mt-1.5 flex items-center gap-2">
                <span>{{ chat.displayTime || chat.createdAt }}</span>
                <span
                  v-if="chatStore.conversationId === chat.id"
                  class="w-1 h-1 rounded-full bg-indigo-400"
                ></span>
              </div>
            </div>

            <button
              @click.stop="handleDelete(chat.id)"
              class="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              title="删除对话"
            >
              <PhTrash size="15" />
            </button>
          </div>

          <div v-if="chatStore.historyLoading" class="flex flex-col items-center py-4 gap-2">
            <div
              class="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"
            ></div>
            <span class="text-[10px] text-slate-400 font-medium">加载中...</span>
          </div>
        </div>
      </div>
    </Transition>

    <section
      class="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#080c14] relative"
    >
      <header
        class="h-16 flex-none border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-6 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl z-20"
      >
        <div class="flex items-center gap-4">
          <h2 class="font-bold text-base text-slate-800 dark:text-slate-100">知链学习助手</h2>
          <span
            class="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
          ></span>
        </div>
      </header>

      <main
        ref="scrollContainer"
        @scroll="handleMessageScroll"
        class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-12 lg:px-24 pt-10 pb-10 space-y-10"
      >
        <div v-if="chatStore.pagination.hasMore" class="text-center py-2">
          <span v-if="loading" class="text-[10px] text-indigo-500 animate-pulse"
            >正在加载历史记录...</span
          >
          <span v-else class="text-[10px] text-slate-400">继续向上滑动查看更多</span>
        </div>

        <div
          v-for="(item, index) in messages"
          :key="item.id || index"
          :class="['flex w-full', item.role === 'user' ? 'justify-end' : 'justify-start']"
        >
          <div
            :class="[
              'flex max-w-[85%] gap-4',
              item.role === 'user' ? 'flex-row-reverse' : 'flex-row',
            ]"
          >
            <div
              :class="[
                'w-9 h-9 flex-none rounded-xl flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800',
                item.role === 'user'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-indigo-600 text-white shadow-lg',
              ]"
            >
              <template v-if="item.role === 'user'">
                <img
                  v-if="userInfo?.avatarUrl"
                  :src="userInfo.avatarUrl"
                  class="w-full h-full object-cover"
                />
                <PhUser v-else size="18" weight="bold" />
              </template>
              <PhSparkle v-else size="18" weight="bold" />
            </div>

            <div class="space-y-2 max-w-full">
              <div
                :class="[
                  'px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm break-words whitespace-pre-wrap',
                  item.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none text-slate-700 dark:text-slate-200',
                ]"
              >
                {{ item.content }}
                <span
                  v-if="item.streaming"
                  class="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle"
                ></span>
              </div>
              <p
                :class="[
                  'text-[10px] text-slate-400 font-medium px-1',
                  item.role === 'user' ? 'text-right' : '',
                ]"
              >
                {{ item.createdAt }}
              </p>
            </div>
          </div>
        </div>
        <div class="h-6"></div>
      </main>

      <footer
        class="flex-none p-4 md:px-12 lg:px-24 bg-white dark:bg-[#080c14] border-t border-slate-50 dark:border-slate-800 shadow-2xl"
      >
        <div
          class="max-w-4xl mx-auto relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] p-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all"
        >
          <textarea
            ref="textareaRef"
            rows="1"
            v-model="input"
            @input="adjustHeight"
            @keydown.enter.prevent="handleSend"
            placeholder="有问题问知链..."
            class="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-slate-700 dark:text-white resize-none max-h-48 custom-scrollbar"
          ></textarea>

          <div class="flex items-center justify-between px-3 pb-2">
            <button
              class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-full transition-all"
            >
              <PhPlus size="20" />
            </button>
            <button
              @click="handleSend"
              :disabled="!input.trim() || loading"
              class="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-20 disabled:grayscale"
            >
              <PhPaperPlaneTilt size="20" weight="fill" />
            </button>
          </div>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { PhSparkle, PhUser } from '@phosphor-icons/vue'
import { useChatStore } from '@/stores/chat.store'
import { useAuthStore } from '@/stores/auth.store'

const chatStore = useChatStore()
const userStore = useAuthStore()

const { userInfo } = storeToRefs(userStore)
const { messages, loading } = storeToRefs(chatStore)

const input = ref('')
const showHistory = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// --- 界面控制逻辑 ---

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    }
  })
}

const adjustHeight = () => {
  const el = textareaRef.value
  if (el) {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }
}

watch(
  () => messages.value,
  (newMsgs, oldMsgs) => {
    // 仅在发送新消息或流式输出时自动触底
    if (newMsgs.length > 0 && oldMsgs.length > 0 && newMsgs[0]?.id === oldMsgs[0]?.id) {
      scrollToBottom()
    } else if (oldMsgs.length === 0) {
      scrollToBottom()
    }
  },
  { deep: true },
)

// --- 核心业务逻辑 ---

const handleSend = () => {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  if (textareaRef.value) textareaRef.value.style.height = 'auto'
  chatStore.sendMessage(text)
  scrollToBottom()
}

const handleSelectChat = async (id: number) => {
  if (chatStore.conversationId === id) return
  await chatStore.loadConversation(id)
  if (window.innerWidth < 1024) showHistory.value = false
  scrollToBottom()
}

const handleDelete = async (id: number) => {
  if (confirm('确定要彻底删除这段对话吗？')) {
    await chatStore.deleteConversation(id)
  }
}

const handleMessageScroll = async (e: Event) => {
  const el = e.target as HTMLElement
  if (
    el.scrollTop === 0 &&
    chatStore.pagination.hasMore &&
    !loading.value &&
    chatStore.conversationId
  ) {
    const prevHeight = el.scrollHeight
    await chatStore.loadNextPage()
    nextTick(() => {
      el.scrollTop = el.scrollHeight - prevHeight
    })
  }
}

const handleHistoryScroll = (e: Event) => {
  const el = e.target as HTMLElement
  if (el.scrollHeight - el.scrollTop <= el.clientHeight + 20) {
    chatStore.loadNextHistoryPage()
  }
}

onMounted(() => {
  chatStore.loadConversationList()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #334155;
}

textarea:focus {
  outline: none;
}

.chat-desktop-wrapper {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  width: 0;
  opacity: 0;
}

.flex.w-full {
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
