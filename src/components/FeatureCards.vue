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
        class="relative h-40 bg-white dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center justify-center overflow-hidden"
      >
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20"
        >
          <svg width="100%" height="100%">
            <circle cx="50%" cy="50%" r="30" fill="transparent" stroke="#E2E8F0" stroke-width="2" />
            <circle cx="20%" cy="30%" r="10" fill="#60A5FA" />
            <circle cx="80%" cy="70%" r="10" fill="#818CF8" />
            <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="#CBD5E1" stroke-width="2" />
            <line x1="50%" y1="50%" x2="80%" y2="70%" stroke="#CBD5E1" stroke-width="2" />
          </svg>
        </div>
        <span class="text-sm font-medium text-slate-400 dark:text-slate-300"
          >正在生成您的个性化知识图谱...</span
        >
      </div>
    </div>
  </div>
</template>
