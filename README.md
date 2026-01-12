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
├── api/ # 接口请求层（只做请求，不写业务逻辑）
│ ├── http.ts
│ └── user.api.ts
├── assets/ # 静态资源
│ ├── images/
│ └── styles/
│ └── index.scss
├── components/ # 全局通用组件
│ ├── BaseButton.vue
│ └── BaseModal.vue
├── icons/ # 图标库
│ └── index.ts
├── layouts/ # 布局组件（页面骨架）
│ └── DefaultLayout.vue
├── router/ # 路由配置
│ └── index.ts
├── stores/ # Pinia 状态管理
│ └── user.ts
├── utils/ # 工具函数
│ └── auth.ts
├── views/ # 页面级组件
│ ├── login/
│ │ └── index.vue
│ └── home/
│ └── index.vue
├── App.vue
└── main.ts
index.html # 应用入口 HTML（Vite 入口）
vite.config.ts # Vite 配置文件
package.json
README.md
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
