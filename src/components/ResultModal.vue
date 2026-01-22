<template>
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div
      class="relative w-[420px] rounded-2xl bg-white px-8 pt-10 pb-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-modal-in"
    >
      <!-- Icon -->
      <div
        class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
        :class="type === 'success' ? 'bg-green-50' : 'bg-red-50'"
      >
        <div
          class="flex h-10 w-10 items-center justify-center rounded-full"
          :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'"
        >
          <span class="text-white text-lg font-bold">
            {{ type === 'success' ? '✓' : '✕' }}
          </span>
        </div>
      </div>

      <!-- Title -->
      <h3 class="text-lg font-semibold text-slate-900">
        {{ title }}
      </h3>

      <!-- Message -->
      <p class="mt-2 mx-auto max-w-[300px] text-sm leading-relaxed text-slate-500">
        {{ message }}
      </p>

      <!-- Action -->
      <button
        class="mt-8 w-full rounded-xl py-2.5 text-sm font-medium text-white transition-all active:scale-[0.98]"
        :class="
          type === 'success'
            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200/60'
            : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200/60'
        "
        @click="$emit('close')"
      >
        {{ buttonText || '确定' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
  type: 'success' | 'error'
  title: string
  message: string
  buttonText?: string
}>()

defineEmits(['close'])
</script>

<style scoped>
@keyframes modal-in {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.2s ease-out;
}
</style>
