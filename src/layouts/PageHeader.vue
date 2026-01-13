<template>
  <header
    class="h-12 w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4"
  >
    <button
      @click="$emit('toggle-sidebar')"
      class="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
    >
      <PhList size="20" class="text-slate-700 dark:text-slate-300" />
    </button>
  </header>
</template>

<script setup>
// 定义事件
defineEmits(['toggle-sidebar'])
</script>
