<template>
  <div class="http404-container">
    <div class="http404">
      <!-- 左侧插画区域 -->
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404" />
        <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="cloud" />
        <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="cloud" />
        <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="cloud" />
      </div>

      <!-- 右侧提示区域 -->
      <div class="info">
        <div class="info__code">404</div>

        <div class="info__title">
          {{ message }}
        </div>

        <div class="info__desc">该学习内容可能不存在、已被移除，或你暂时没有访问权限。</div>

        <div class="info__desc">请返回学习首页，继续你的学习进程。</div>

        <router-link to="/" class="info__back"> 返回学习首页 </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const message = computed(() => {
  return '你访问的学习页面不存在'
})
</script>

<style lang="scss" scoped>
.http404-container {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.http404 {
  position: relative;
  width: 1200px;
  padding: 0 50px;
  overflow: hidden;
}

/* 左侧插画 */
.pic-404 {
  position: relative;
  float: left;
  width: 600px;
  overflow: hidden;

  &__parent {
    width: 100%;
  }

  &__child {
    position: absolute;

    &.left {
      width: 80px;
      top: 17px;
      left: 220px;
      opacity: 0;
      animation: cloudLeft 2s linear 1s forwards;
    }

    &.mid {
      width: 46px;
      top: 10px;
      left: 420px;
      opacity: 0;
      animation: cloudMid 2s linear 1.2s forwards;
    }

    &.right {
      width: 62px;
      top: 100px;
      left: 500px;
      opacity: 0;
      animation: cloudRight 2s linear 1s forwards;
    }
  }
}

/* 右侧信息 */
.info {
  position: relative;
  float: left;
  width: 320px;
  padding: 40px 0;

  &__code {
    font-size: 40px;
    font-weight: bold;
    color: #3b82f6;
    opacity: 0;
    margin-bottom: 20px;
    animation: slideUp 0.5s forwards;
  }

  &__title {
    font-size: 20px;
    font-weight: bold;
    color: #222;
    opacity: 0;
    margin-bottom: 12px;
    animation: slideUp 0.5s 0.1s forwards;
  }

  &__desc {
    font-size: 14px;
    color: #6b7280;
    line-height: 22px;
    opacity: 0;
    margin-bottom: 12px;
    animation: slideUp 0.5s 0.2s forwards;
  }

  &__back {
    display: inline-block;
    margin-top: 10px;
    width: 140px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    background: #3b82f6;
    color: #fff;
    border-radius: 18px;
    font-size: 14px;
    opacity: 0;
    animation: slideUp 0.5s 0.3s forwards;
  }
}

/* 动画 */
@keyframes slideUp {
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes cloudLeft {
  0% {
    top: 17px;
    left: 220px;
    opacity: 0;
  }
  20% {
    top: 33px;
    left: 188px;
    opacity: 1;
  }
  80% {
    top: 81px;
    left: 92px;
    opacity: 1;
  }
  100% {
    top: 97px;
    left: 60px;
    opacity: 0;
  }
}

@keyframes cloudMid {
  0% {
    top: 10px;
    left: 420px;
    opacity: 0;
  }
  20% {
    top: 40px;
    left: 360px;
    opacity: 1;
  }
  70% {
    top: 130px;
    left: 180px;
    opacity: 1;
  }
  100% {
    top: 160px;
    left: 120px;
    opacity: 0;
  }
}

@keyframes cloudRight {
  0% {
    top: 100px;
    left: 500px;
    opacity: 0;
  }
  20% {
    top: 120px;
    left: 460px;
    opacity: 1;
  }
  80% {
    top: 180px;
    left: 340px;
    opacity: 1;
  }
  100% {
    top: 200px;
    left: 300px;
    opacity: 0;
  }
}
</style>
