import { marked } from 'marked'
import DOMPurify from 'dompurify'

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 转换换行符
  gfm: true     // 启用 GitHub flavored markdown（包含表格和任务列表支持）
})

// 配置 DOMPurify：增加了 AI 常用标签 (a, img, hr, sub, sup, details, summary)
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'div', 'span',
    'a', 'img', 'hr', 'sub', 'sup', 'details', 'summary'
  ],
  ALLOWED_ATTR: [
    'class', 'style', 'align', 'colspan', 'rowspan', 'scope',
    'href', 'target', 'rel', 'src', 'alt', 'title' // 允许链接和图片的必要属性
  ],
  FORBID_TAGS: ['script', 'style', 'link', 'meta', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['on*']
}

// 增加一个 DOMPurify 钩子，确保所有 AI 生成的链接都在新标签页打开，且防范安全风险
DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if ('target' in node) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

/**
 * 将 Markdown 内容格式化为安全的 HTML
 */
export const formatMarkdownContent = (content: string): string => {
  if (!content) return ''
  
  try {
    const html = marked.parse(content)
    return DOMPurify.sanitize(html as string, purifyConfig)
  } catch (error) {
    console.warn('Markdown parsing error:', error)
    return DOMPurify.sanitize(content, purifyConfig)
  }
}

/**
 * 获取Markdown内容的CSS样式字符串 (仿 GitHub / Notion 质感)
 */
export const getMarkdownStyles = (): string => {
  return `
    .markdown-content {
      line-height: 1.7;
      color: #334155;
      word-wrap: break-word;
      font-size: 15px;
    }

    .dark .markdown-content {
      color: #cbd5e1;
    }

    /* 标题统一样式 */
    .markdown-content h1,
    .markdown-content h2,
    .markdown-content h3,
    .markdown-content h4,
    .markdown-content h5,
    .markdown-content h6 {
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      font-weight: 600;
      color: #0f172a;
      line-height: 1.3;
    }

    .dark .markdown-content h1,
    .dark .markdown-content h2,
    .dark .markdown-content h3,
    .dark .markdown-content h4,
    .dark .markdown-content h5,
    .dark .markdown-content h6 {
      color: #f8fafc;
    }

    .markdown-content h1 { font-size: 1.6em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
    .markdown-content h2 { font-size: 1.4em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
    .markdown-content h3 { font-size: 1.25em; }
    
    .dark .markdown-content h1,
    .dark .markdown-content h2 { border-bottom-color: #334155; }

    /* 段落与链接 */
    .markdown-content p { margin: 1em 0; }
    .markdown-content a { color: #2563eb; text-decoration: none; word-break: break-all; }
    .markdown-content a:hover { text-decoration: underline; }
    .dark .markdown-content a { color: #60a5fa; }

    /* 分割线 */
    .markdown-content hr {
      height: 1px;
      padding: 0;
      margin: 2em 0;
      background-color: #e2e8f0;
      border: 0;
    }
    .dark .markdown-content hr { background-color: #334155; }

    /* 列表优化 (支持多级嵌套) */
    .markdown-content ul,
    .markdown-content ol {
      margin: 1em 0;
      padding-left: 1.5em;
    }
    .markdown-content ul ul,
    .markdown-content ol ol,
    .markdown-content ul ol,
    .markdown-content ol ul {
      margin: 0.2em 0;
    }
    .markdown-content li { margin: 0.4em 0; }
    /* 解决 AI 返回的列表项中包裹 p 标签导致间距过大的问题 */
    .markdown-content li > p { margin: 0.2em 0; }

    /* 引用块 */
    .markdown-content blockquote {
      margin: 1.2em 0;
      padding: 0.5em 1em;
      border-left: 4px solid #94a3b8;
      background-color: #f8fafc;
      color: #64748b;
      border-radius: 0 4px 4px 0;
    }
    .dark .markdown-content blockquote {
      background-color: #1e293b;
      border-left-color: #64748b;
      color: #94a3b8;
    }

    /* 行内代码 */
    .markdown-content code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: #f1f5f9;
      color: #ef4444; /* 给行内代码一点高亮色，区分度更好 */
      border-radius: 4px;
      font-family: ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    }
    .dark .markdown-content code {
      background-color: #334155;
      color: #fca5a5;
    }

    /* 代码块 (优先级高于行内代码) */
    .markdown-content pre {
      margin: 1.2em 0;
      padding: 1em;
      overflow-x: auto; /* 允许横向滚动 */
      border-radius: 8px;
      background-color: #1e293b; /* 建议无论明暗主题，代码块都偏暗色，阅读体验更好 */
      color: #f8fafc;
    }
    .dark .markdown-content pre {
      background-color: #0f172a;
    }
    .markdown-content pre code {
      padding: 0;
      margin: 0;
      font-size: 85%;
      background: transparent;
      color: inherit;
      border-radius: 0;
      display: block;
      white-space: pre; /* 保持格式 */
    }

    /* 滚动条美化 (针对代码块和表格) */
    .markdown-content pre::-webkit-scrollbar { height: 8px; }
    .markdown-content pre::-webkit-scrollbar-track { background: transparent; }
    .markdown-content pre::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
    .markdown-content pre::-webkit-scrollbar-thumb:hover { background: #64748b; }

    /* 表格容器级别的滚动 (兼容很宽的对比表) */
    .markdown-content table {
      display: block; /* 使表格可以独立滚动 */
      overflow-x: auto;
      width: 100%;
      border-collapse: collapse;
      margin: 1.2em 0;
      font-size: 0.9em;
    }
    .markdown-content th,
    .markdown-content td {
      padding: 0.75em 1em;
      border: 1px solid #e2e8f0;
      min-width: 100px; /* 防止内容过于拥挤 */
    }
    .dark .markdown-content th,
    .dark .markdown-content td {
      border-color: #334155;
    }
    .markdown-content th {
      background-color: #f8fafc;
      font-weight: 600;
    }
    .dark .markdown-content th {
      background-color: #0f172a;
    }
    .markdown-content tr:nth-child(even) { background-color: #fcfcfc; }
    .dark .markdown-content tr:nth-child(even) { background-color: #162032; }

    /* 图片 */
    .markdown-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1em 0;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); /* 增加一点微阴影 */
    }
  `
}

/**
 * 创建并注入Markdown样式到页面
 */
export const injectMarkdownStyles = (containerId?: string): void => {
  const styleId = containerId ? `markdown-styles-${containerId}` : 'markdown-styles'
  
  if (document.getElementById(styleId)) {
    return
  }
  
  const styleElement = document.createElement('style')
  styleElement.id = styleId
  
  if (containerId) {
    const scopedStyles = getMarkdownStyles()
      .replace(/\.markdown-content/g, `#${containerId} .markdown-content`)
      .replace(/\.dark/g, `#${containerId}.dark`)
    styleElement.textContent = scopedStyles
  } else {
    styleElement.textContent = getMarkdownStyles()
  }
  
  document.head.appendChild(styleElement)
}