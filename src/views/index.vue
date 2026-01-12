<template>
  <div class="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-700">
    <!-- 导航栏组件 -->
    <Navigation />

    <!-- 主内容区域 -->
    <main
      class="pt-32 pb-20 px-6 bg-gradient-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800 text-slate-800 dark:text-slate-100 transition-colors"
    >
      <!-- 英雄区域组件 -->
      <HeroSection />
      <!-- 卡片区域组件 -->
      <FeatureCards />

      <!-- 学习路径推荐组件 -->
      <LearningPath />
    </main>

    <!-- 页脚 -->
    <Footer />
    <!-- 认证模态框 -->
    <AuthModal />
  </div>
</template>

<script setup>
/* * 
  根布局文件，包含导航栏、主内容区域、页脚，和认证模态框组件。
  */
import Footer from '@/layouts/Footer.vue'
import Navigation from '@/layouts/Navigation.vue'
import FeatureCards from '@/components/FeatureCards.vue'
import HeroSection from '@/components/HeroSection.vue'
import LearningPath from '@/components/LearningPath.vue'
import AuthModal from '@/components/AuthModal.vue'
</script>
