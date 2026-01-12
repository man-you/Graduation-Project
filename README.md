# 云链学习平台

# Vue 3 + Vite 项目工程规范说明

## 一、项目技术栈

- 前端框架：Vue 3
- 构建工具：Vite
- 语言：TypeScript
- 路由：Vue Router
- 状态管理：Pinia
- 代码规范：ESLint + Prettier
- 包管理：npm

---

## 二、项目启动

### 1. 安装依赖

npm install

### 2. 启动开发环境

npm run dev

### 3. 构建生产环境

npm run build

### 4. 预览生产构建

npm run preview

---

## 三、工程目录结构规范

```
public/ # 公共静态资源（不会被 Vite 处理）
src/
├── api/ # 接口请求层（只做请求，不写业务逻辑）【当前代码库暂未实现】
│   ├── http.ts
│   └── user.api.ts
├── assets/ # 静态资源
│   ├── 401_images/
│   │   └── 401.gif
│   ├── 404_images/
│   │   ├── 404.png
│   │   └── 404_cloud.png
│   └── tailwind.css # 样式文件（替代规范中 styles/index.scss）
├── components/ # 全局通用组件
│   ├── AuthModal.vue # 认证弹窗组件
│   ├── FeatureCards.vue # 功能卡片组件
│   ├── HeroSection.vue # 首页英雄区组件
│   └── LearningPath.vue # 学习路径组件
├── icons/ # 图标库
│   └── index.ts # 全局图标注册（Phosphor Icons）
├── layouts/ # 布局组件（页面骨架）
│   ├── Footer.vue # 页脚布局
│   └── Navigation.vue # 导航栏布局
├── router/ # 路由配置
│   └── index.ts # 路由核心配置（常量/异步路由、重置方法）
├── stores/ # Pinia 状态管理
│   ├── auth.ts # 认证状态管理（登录/注册模态框）
│   └── counter.ts # 示例计数器状态
├── util/ # 工具函数（规范为utils，实际命名util）
│   ├── routerUtil.ts # 路由工具（返回上一级）
│   └── storageUtil.ts # 本地存储工具（local/sessionStorage）
├── views/ # 页面级组件
│   ├── index.vue # 首页
│   └── error-page/ # 错误页目录
│       ├── 401.vue # 401无权限页
│       └── 404.vue # 404不存在页
├── App.vue # 根组件（路由出口）
├── main.ts # 应用入口（注册Pinia/路由/全局组件）
└── shims-vue.d.ts # Vue组件类型声明（TS类型补充）
index.html # 应用入口 HTML（Vite 入口）
vite.config.ts # Vite 配置文件【当前代码库未展示】
package.json # 项目依赖配置
README.md # 项目说明文档
```

### 目录设计原则

- views：页面（只对应路由）
- components：可复用组件（不直接挂路由）
- layouts：布局组件（Header / Sidebar / Footer）
- api：接口层，只负责 HTTP 请求
- stores：全局状态
- utils：纯工具函数，无副作用

---

## 四、应用入口说明

### index.html

```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
说明： Vite 项目中，index.html 即应用入口。
```
