<template>
  <section class="py-20 border-t border-slate-100 dark:border-slate-700">
    <div class="max-w-7xl mx-auto px-6 text-center">
      <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-4">个性化学习路径</h2>
      <p class="text-slate-500 dark:text-slate-300 text-lg max-w-xl mx-auto">
        基于您的学习目标、知识掌握程度和学习偏好，AI 智能生成专属进阶路径。
      </p>
      <div class="mt-12 grid md:grid-cols-3 gap-8">
        <!-- 路径卡片 -->
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md dark:shadow-slate-700 border border-slate-100 dark:border-slate-700 flex flex-col items-start hover:-translate-y-1 transition-transform"
        >
          <div
            class="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4"
          >
            <PhBookOpen size="20" class="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">教学资源生成</h3>
          <p class="text-sm text-slate-500 dark:text-slate-300 flex-grow">
            从教案，到演示PPT，演示图片知链一站式搞定。
          </p>
          <a
            href="#"
            class="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline"
            >探索路径 <i class="ph ph-arrow-right"></i
          ></a>
        </div>
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md dark:shadow-slate-700 border border-slate-100 dark:border-slate-700 flex flex-col items-start hover:-translate-y-1 transition-transform"
        >
          <div
            class="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4"
          >
            <PhGraduationCap size="20" class="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">学习记录分析</h3>
          <p class="text-sm text-slate-500 dark:text-slate-300 flex-grow">
            基于历史数据智能复盘，精准定位薄弱环节与提分策略。
          </p>
          <a
            href="#"
            class="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline"
            >探索路径 <i class="ph ph-arrow-right"></i
          ></a>
        </div>
        <div
          class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md dark:shadow-slate-700 border border-slate-100 dark:border-slate-700 flex flex-col items-start hover:-translate-y-1 transition-transform"
        >
          <div
            class="w-10 h-10 bg-blue-50 dark:bg-blue-900 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4"
          >
            <PhLightbulb size="20" class="text-blue-600 dark:text-blue-400" />
          </div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2">可视化图谱</h3>
          <p class="text-sm text-slate-500 dark:text-slate-300 flex-grow">
            图谱互动，知识可视化，答题互动。
          </p>
          <a
            href="#"
            class="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline"
            >探索路径 <i class="ph ph-arrow-right"></i
          ></a>
        </div>
      </div>
    </div>
  </section>
</template>
