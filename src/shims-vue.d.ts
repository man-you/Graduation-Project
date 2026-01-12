// 声明所有 .vue 后缀的文件，告诉TS这是Vue组件类型，这是解决的是.vue文件引入时报错的问题
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 声明.vue文件的类型为Vue组件，关闭any类型警告
  const component: DefineComponent<{}, {}, any>
  export default component
}
