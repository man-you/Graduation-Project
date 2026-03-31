<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click="handleBackdropClick"
  >
    <div
      class="relative w-[420px] rounded-2xl bg-white px-8 pt-10 pb-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-modal-in"
      @click.stop
    >
      <!-- Close Button -->
      <button
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-all duration-200 shadow-sm"
        @click="handleClose"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

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
        @click="handleConfirm"
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

const emit = defineEmits(['close', 'confirm'])

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  emit('close')
}
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
