import './assets/tailwind.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { icons } from './icons/index'

const app = createApp(App)

// 全局注册图标组件
// as类型断言操作符，typeof 类型查询操作符， keyof 索引类型查询操作符
Object.keys(icons).forEach((key) => {
  // 获取icons对象中所有属性名组合的联合类型
  app.component(key, icons[key as keyof typeof icons])
})

app.use(createPinia())
app.use(router)

app.mount('#app')
