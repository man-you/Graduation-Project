# 云链学习平台

## Vue 3 + Vite 项目工程规范说明

### 项目简介
云链学习平台是一个基于 Vue 3 和 Vite 构建的现代化前端项目，旨在提供清晰的工程化规范和可扩展的架构设计。

### 核心目标
- 统一代码风格与目录结构
- 实现模块化、可维护的前端架构
- 支持 TypeScript 类型安全与构建优化

---

## 一、项目技术栈

- 前端框架：Vue 3
- 构建工具：Vite
- 语言：TypeScript
- 路由：Vue Router
- 状态管理：Pinia
- UI 框架：Tailwind CSS + Phosphor Icons
- HTTP 客户端：Axios
- 状态持久化：js-cookie
- 代码规范：ESLint + Prettier
- 包管理：npm

---

## 二、项目启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

### 3. 构建生产环境

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

### 5. 代码检查与修复

```bash
npm run lint
```

### 6. 格式化代码

```bash
npm run format
```

### 7. 类型检查

```bash
npm run type-check
```

---

## 三、工程目录结构规范

```
src/
├── api/ # 接口请求层（只做请求，不写业务逻辑）
│   ├── chat/ # 聊天相关API
│   ├── mock/ # 模拟数据
│   └── user/ # 用户相关API
├── assets/ # 静态资源
│   └── tailwind.css
├── components/ # 全局通用组件
│   ├── AuthModal.vue # 认证弹窗组件
│   ├── FeatureCards.vue # 功能卡片组件
│   ├── HeroSection.vue # 首页英雄区组件
│   ├── LearningPath.vue # 学习路径组件
│   └── ResultModal.vue # 结果弹窗组件
├── icons/ # 图标库
│   └── icon.ts # 全局图标注册
├── layouts/ # 布局组件（页面骨架）
│   ├── Footer.vue # 页脚布局
│   ├── Navigation.vue # 导航栏布局
│   ├── PageHeader.vue # 页面头部布局
│   └── SideBar.vue # 侧边栏布局
├── router/ # 路由配置
│   ├── config/ # 路由配置
│   │   └── roleHomeMap.ts # 角色路由映射
│   ├── module/ # 路由模块
│   │   ├── admin.ts
│   │   ├── student.routes.ts
│   │   └── teacher.routes.ts
│   └── index.ts # 路由核心配置
├── stores/ # Pinia 状态管理
│   ├── auth.store.ts # 认证状态管理
│   ├── chat.store.ts # 聊天状态管理
│   └── counter.ts # 示例计数器状态
├── types/ # 数据类型定义
│   ├── chat/ # 聊天相关类型
│   │   └── chat.type.ts
│   └── user/ # 用户相关类型
│       └── user.type.ts
├── util/ # 工具函数（纯工具函数，无副作用）
│   ├── authUtil.ts # 认证相关工具
│   ├── guardUtil.ts # 守卫相关工具
│   ├── requestUtil.ts # 请求相关工具
│   ├── routerUtil.ts # 路由相关工具
│   ├── storageUtil.ts # 存储相关工具
│   └── validateSecurityForm.ts # 表单验证工具
├── views/ # 页面级组件
│   ├── error-page/ # 错误页目录
│   │   ├── 401.vue # 401无权限页
│   │   └── 404.vue # 404不存在页
│   ├── public/ # 公共页面
│   │   └── Chat.vue # 聊天页面
│   ├── setting/ # 设置页面
│   │   └── Setting.vue # 设置页面
│   ├── study/ # 学习页面
│   │   └── study.vue # 学习页面布局
│   └── index.vue # 首页
├── App.vue # 根组件（路由出口）
├── guard.ts # 路由守卫
├── main.ts # 应用入口（注册Pinia/路由/全局组件）
├── request.ts # 请求配置
└── shims-vue.d.ts # Vue组件类型声明（TS类型补充）
```

### 目录设计原则

#### 项目目录设计说明（简要版）

- **views**: 页面组件，仅与路由绑定（如首页、401/404错误页）
- **components**: 可复用业务组件，不直接挂载路由（如认证弹窗、学习路径卡片）
- **layouts**: 布局组件，封装页面骨架（导航栏Header、页脚Footer）
- **api**: 接口请求层，仅处理HTTP请求，无业务逻辑
- **stores**: 全局状态管理（如认证状态、计数器）
- **util**（项目内命名util）: 纯工具函数，无副作用（如存储、路由操作）
- **assets**: 静态资源（图片、样式文件）
- **icons**: 全局图标注册与管理
- **router**: 路由配置（常量路由/异步路由）

---

## 四、应用入口说明

### index.html

```html
<div id="app"></div>
<script type="module" src="/src/main.ts"></script>
```

说明：Vite 项目中，index.html 即应用入口。

---

## 五、开发规范

### 代码规范

- 目录命名统一（如 util 而非 utils）
- API 层不得包含业务逻辑
- 工具函数应为无副作用的纯函数
- 组件名称使用 PascalCase 命名法
- 变量和函数名称使用 camelCase 命名法

### 组件开发

- 遵循单一职责原则，组件功能尽可能单一
- 使用 TypeScript 接口定义 props 类型
- 合理使用组合式 API (Composition API)
- 优先使用 Pinia 进行状态管理

### 代码质量

- 使用 ESLint 检查代码规范
- 使用 Prettier 统一代码风格
- 提交前必须通过类型检查
- 关键逻辑需要编写单元测试

---

## 六、部署说明

### 构建命令

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

部署时将 [dist](dist/) 目录下的内容部署到服务器即可。

---