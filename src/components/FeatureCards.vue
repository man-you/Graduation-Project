<template>
  <!-- 卡片区域组件 -->
  <div class="max-w-7xl mx-auto mt-20 grid lg:grid-cols-2 gap-8 items-stretch">
    <!-- AI 智能助手 卡片 -->
    <div
      class="bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-xl dark:shadow-slate-700 border border-slate-100 dark:border-slate-700 flex flex-col justify-between hover:-translate-y-1 transition-transform"
    >
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-blue-50 dark:bg-blue-900 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400"
          >
            <PhChatText size="24" weight="fill" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">AI 学习助手</h3>
        </div>
        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          无论你遇到何种学习难题或知识点困惑，AI智能助手都能提供实时、个性化的帮助。它会根据你的学习进度和知识图谱，给出最贴合的解答与学习建议。
        </p>
      </div>
      <div class="relative bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
        <div class="flex items-start gap-3">
          <PhChatCircle size="20" class="text-blue-600 dark:text-blue-400 mt-1" />
          <div class="flex-1">
            <p class="text-xs text-slate-400 dark:text-slate-300 mb-1">知链 AI 助手</p>
            <p class="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              你当前的{{ ' ' }}
              <span class="font-bold text-blue-600 dark:text-blue-400">数据分析知识点</span>
              {{ ' ' }}掌握度为65%，建议先巩固基础概念，再进行案例实操练习。
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 知识图谱 卡片 -->
    <div
      class="bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-[2rem] p-8 shadow-xl dark:shadow-slate-700 border border-slate-100 dark:border-slate-700 flex flex-col justify-between hover:-translate-y-1 transition-transform"
    >
      <div>
        <div class="flex items-center gap-3 mb-6">
          <div
            class="w-12 h-12 bg-indigo-50 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400"
          >
            <PhNetwork size="24" class="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">可视化知识图谱</h3>
        </div>
        <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          将全领域学习知识可视化为交互式图谱。你可以点击任何知识点节点，查看详细解析、关联内容、学习资源，并自定义构建专属的个性化学习路径。
        </p>
      </div>

      <div
        class="relative h-40 rounded-xl border border-slate-100 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-700 flex items-center justify-center overflow-hidden"
      >
        <!-- 背景弱纹理 -->
        <div class="absolute inset-0 opacity-[0.03]">
          <div
            class="w-full h-full bg-[radial-gradient(circle_at_20%_30%,#3b82f6,transparent_40%)]"
          ></div>
        </div>

        <!-- 内容 -->
        <div class="relative z-10 text-center space-y-3">
          <div class="flex items-center justify-center gap-2">
            <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span class="text-sm font-medium text-slate-600 dark:text-slate-300">
              正在为你构建学习结构
            </span>
          </div>

          <p class="text-xs text-slate-400 dark:text-slate-400">
            分析知识依赖 · 构建学习路径 · 关联学习资源
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
