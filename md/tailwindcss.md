### 引入tailwindcss

- npm install -D tailwindcss@3 postcss autoprefixer（默认的最新版本有问题）
- 初始化 npx tailwindcss@3 init
- 配置 tailwind.config.js

### 配置tailwindcss.config.js文件

```
  扫描入口 html 以及 src 目录下所有 Vue / JS / TS 文件中的 class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],

```

### 在 src/ 下创建样式文件（推荐）

```
src/assets/tailwind.css
配置：这三行是 Tailwind 的“入口”，没有它什么都不会生成。
@tailwind base;
@tailwind components;
@tailwind utilities;

```

### 引入样式文件(main.te文件中)

```
import './assets/tailwind.css'

```
