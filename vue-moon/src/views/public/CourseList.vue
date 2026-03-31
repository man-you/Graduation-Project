<div class="flex items-center mb-8">
  <div
    class="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 text-blue-700 dark:text-blue-400 mr-4"
  >
    <PhGraduationCap
      weight="bold"
      size="32"
      class="transition-transform group-hover:-rotate-3"
    />
  </div>
  <div class="flex-1 flex justify-between items-center">
    <h3
      class="text-2xl font-bold text-slate-600 dark:text-slate-100 mb-0 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors line-clamp-2"
    >
      {{ course.title }}
    </h3>
    <div
      v-if="userRole !== 'teacher' && course.isCompleted"
      class="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg text-[11px] font-black tracking-widest uppercase border border-emerald-100 dark:border-emerald-500/20 ml-4"
    >
      COMPLETED
    </div>
  </div>
</div>
