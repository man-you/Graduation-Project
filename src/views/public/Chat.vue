<template>
  <div
    class="chat-desktop-wrapper min-h-screen bg-[#f8f9fc] dark:bg-[#06080f] text-slate-900 dark:text-slate-100 flex overflow-hidden font-sans"
  >
    <aside
      class="w-16 flex-none bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 z-30"
    >
      <div
        class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg mb-8"
      >
        <PhGraph size="24" weight="fill" />
      </div>

      <nav class="flex flex-col gap-6">
        <button
          @click="showHistory = !showHistory"
          :class="[
            'p-2.5 rounded-xl transition-all hover:bg-slate-100 dark:hover:bg-slate-800',
            showHistory ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-400',
          ]"
          title="对话历史"
        >
          <PhClockCounterClockwise size="24" weight="duotone" />
        </button>
      </nav>
    </aside>

    <transition name="drawer">
      <div v-if="showHistory" class="fixed inset-0 z-40 flex">
        <div
          class="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          @click="showHistory = false"
        ></div>
        <div
          class="relative w-80 bg-white dark:bg-slate-900 h-full shadow-2xl border-r border-slate-200 dark:border-slate-800 flex flex-col animate-drawer-in"
        >
          <div
            class="p-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50"
          >
            <h3 class="font-bold text-lg">对话历史</h3>
            <button
              @click="showHistory = false"
              class="w-9 h-9 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-100 dark:shadow-none transition-all active:scale-90 group"
            >
              <PhX size="20" weight="bold" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
            <div
              v-for="i in 5"
              :key="i"
              class="p-4 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer group transition-all border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800"
            >
              <p
                class="text-sm font-semibold truncate mb-1 group-hover:text-indigo-600 transition-colors"
              >
                深度学习基础架构探讨 #{{ i }}
              </p>
              <p class="text-[11px] text-slate-400">2026年1月27日 · 12条消息</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <section class="flex-1 flex flex-col relative bg-white dark:bg-[#080c14]">
      <header
        class="h-16 flex-none border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md"
      >
        <div class="flex items-center gap-3">
          <h2 class="font-bold text-lg">知链学习助手</h2>
          <span
            class="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full font-bold uppercase tracking-wider"
            >Active</span
          >
        </div>
        <button class="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
          <PhShareNetwork size="22" />
        </button>
      </header>

      <main
        class="flex-1 overflow-y-auto custom-scrollbar px-4 md:px-12 lg:px-24 pt-10 pb-32 space-y-10"
      >
        <div
          v-for="(item, index) in demoMessages"
          :key="index"
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
                'w-8 h-8 flex-none rounded-lg flex items-center justify-center',
                item.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-100',
              ]"
            >
              <component :is="item.role === 'user' ? PhUser : PhSparkle" size="16" weight="bold" />
            </div>
            <div class="space-y-2">
              <div
                :class="[
                  'px-5 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm',
                  item.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-tl-none',
                ]"
              >
                {{ item.content }}
              </div>
              <p
                :class="[
                  'text-[10px] text-slate-400 font-medium px-1',
                  item.role === 'user' ? 'text-right' : '',
                ]"
              >
                {{ item.time }}
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer class="absolute bottom-0 left-0 right-0 p-6 md:px-12 lg:px-24">
        <div
          class="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[2rem] p-2 shadow-xl focus-within:border-indigo-400 transition-all"
        >
          <textarea
            rows="1"
            placeholder="有问题问知链..."
            class="w-full bg-transparent border-none focus:ring-0 px-4 py-3 text-slate-700 dark:text-white resize-none"
          ></textarea>

          <div class="flex items-center justify-between px-3 pb-2">
            <div class="flex gap-1">
              <button
                class="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full transition-all"
              >
                <PhPlus size="20" />
              </button>
            </div>

            <button
              class="bg-indigo-600 hover:bg-indigo-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg active:scale-90"
            >
              <PhPaperPlaneTilt size="20" weight="fill" />
            </button>
          </div>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { PhSparkle } from '@phosphor-icons/vue'

const showHistory = ref(false)

const demoMessages = [
  {
    role: 'ai',
    content: '您好，针对您感兴趣的“深度学习”领域，我已经为您定位到了关键的知识切入点。',
    time: '14:20 PM',
  },
  { role: 'user', content: '能详细说说 CNN 是如何处理图像空间特征的吗？', time: '14:22 PM' },
  { role: 'ai', content: '卷积神经网络（CNN）的核心在于局部感受野和权值共享。', time: '14:23 PM' },
]
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

@keyframes drawerIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
.animate-drawer-in {
  animation: drawerIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

textarea:focus {
  outline: none;
}
</style>
