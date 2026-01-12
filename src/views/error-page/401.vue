<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <!-- 左侧文案 -->
      <div>
        <h1 class="font-medium text-blue-600 mb-2">401 Unauthorized</h1>

        <h2 class="font-bold text-gray-900 mb-4">你暂无权限访问该学习内容</h2>

        <p class="text-gray-600 mb-6 leading-relaxed">
          该页面可能属于尚未开放的课程、受限的知识模块， 或需要更高的学习权限才能访问。
        </p>

        <div class="flex flex-wrap gap-4">
          <button
            @click="handleBack"
            class="px-6 py-2.5 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            返回
          </button>
        </div>
      </div>

      <!-- 右侧插画 -->
      <div class="flex justify-center">
        <img src="@/assets/401_images/401.gif" alt="Unauthorized" class="max-w-xs md:max-w-sm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { routerBack } from '@/util/routerUtil'

const handleBack = () => {
  routerBack('/')
}
</script>
