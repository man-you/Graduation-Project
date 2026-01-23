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
├── api/ # 接口请求层（只做请求，不写业务逻辑）
│   └── mock/
│       └── menu.ts # 菜单数据模拟
├── assets/ # 静态资源
│   └── tailwind.css # 样式文件
├── components/ # 全局通用组件
│   ├── AuthModal.vue # 认证弹窗组件
│   ├── FeatureCards.vue # 功能卡片组件
│   ├── HeroSection.vue # 首页英雄区组件
│   └── LearningPath.vue # 学习路径组件
├── icons/ # 图标库
│   └── index.ts # 全局图标注册（Phosphor Icons）
├── layouts/ # 布局组件（页面骨架）
│   ├── Footer.vue # 页脚布局
│   ├── Navigation.vue # 导航栏布局
│   ├── PageHeader.vue # 页面头部布局（新增）
│   └── SideBar.vue # 侧边栏布局
├── router/ # 路由配置
│   └── index.ts # 路由核心配置（常量/异步路由、重置方法）
├── stores/ # Pinia 状态管理
│   ├── auth.ts # 认证状态管理（登录/注册模态框）
│   └── counter.ts # 示例计数器状态
├── types/ # 数据类型定义
│   ├── user.ts # 用户信息定义（用户信息）
│
├── util/ # 工具函数（规范为utils，实际命名util）
│   ├── routerUtil.ts # 路由工具（返回上一级）
│   └── storageUtil.ts # 本地存储工具（local/sessionStorage）
├── views/ # 页面级组件
│   ├── index.vue # 首页
│   ├── study/
│   │   └── index.vue # 学习页面（带侧边栏布局）
│   └── error-page/ # 错误页目录
│       ├── 401.vue # 401无权限页
│       └── 404.vue # 404不存在页
├── App.vue # 根组件（路由出口）
├── main.ts # 应用入口（注册Pinia/路由/全局组件）
└── shims-vue.d.ts # Vue组件类型声明（TS类型补充）
index.html # 应用入口 HTML（Vite 入口）
vite.config.ts # Vite 配置文件
package.json # 项目依赖配置
README.md # 项目说明文档
### 目录设计原则

### 项目目录设计说明（简要版）

- views：页面组件，仅与路由绑定（如首页、401/404错误页）
- components：可复用业务组件，不直接挂载路由（如认证弹窗、学习路径卡片）
- layouts：布局组件，封装页面骨架（导航栏Header、页脚Footer）
- api：接口请求层（预留），仅处理HTTP请求，无业务逻辑
- stores：全局状态管理（如认证状态、计数器）
- utils（项目内命名util）：纯工具函数，无副作用（如存储、路由操作）
- assets：静态资源（图片、样式文件）
- icons：全局图标注册与管理
- router：路由配置（常量路由/异步路由）

```

## 四、应用入口说明

### index.html

```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
说明： Vite 项目中，index.html 即应用入口。
```
