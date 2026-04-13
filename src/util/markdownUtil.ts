import { marked } from 'marked'
import DOMPurify from 'dompurify'

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 核心：保留换行符，防止文字堆叠
  gfm: true     // 支持 GitHub 表格、任务列表
})

// 配置 DOMPurify：保持原有配置，增加对语义化标签的宽容度
const purifyConfig = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'caption', 'div', 'span',
    'a', 'img', 'hr', 'sub', 'sup', 'details', 'summary'
  ],
  ALLOWED_ATTR: [
    'class', 'style', 'align', 'colspan', 'rowspan', 'scope',
    'href', 'target', 'rel', 'src', 'alt', 'title'
  ],
  FORBID_TAGS: ['script', 'style', 'link', 'meta', 'iframe', 'object', 'embed'],
  FORBID_ATTR: ['on*']
}

DOMPurify.addHook('afterSanitizeAttributes', function (node) {
  if ('target' in node) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer')
  }
})

/**
 * 格式化逻辑优化：增强文本语义感
 */
export const formatMarkdownContent = (content: string): string => {
  if (!content) return ''

  // 预处理：优化空格和特定标识符，增加阅读时的视觉引导
  let enhanced = content
    .replace(/^> (注意|警告|重点)：/gm, '> 💡 **$1**：')
    .replace(/^> (建议|提示)：/gm, '> 🛠️ **$1**：')
    .replace(/^> (结论|总结)：/gm, '> 🎯 **$1**：')
    // 确保列表符号后有空格，防止解析失效
    .replace(/^([\s]*[-*+])([^\s])/, '$1 $2')

  try {
    const html = marked.parse(enhanced)
    return DOMPurify.sanitize(html as string, purifyConfig)
  } catch (error) {
    console.warn('Markdown parsing error:', error)
    return DOMPurify.sanitize(content, purifyConfig)
  }
}

/**
 * 样式深度优化：重点解决“阅读压力”
 */
export const getMarkdownStyles = (): string => {
  return `
    .markdown-content {
      line-height: 1.8; /* 核心：行高从1.5提升至1.8，极大缓解长文阅读压力 */
      color: #334155;
      word-wrap: break-word;
      font-size: 15.5px;
      letter-spacing: 0.02em; /* 微增字间距 */
    }

    .dark .markdown-content { color: #cbd5e1; }

    /* 段落间距：让“空格感”由内而外 */
    .markdown-content p {
      margin: 1.2rem 0;
      white-space: pre-wrap; /* 保持原始空格感 */
    }

    /* 标题美化：渐变侧边栏增强结构感 */
    .markdown-content h1, .markdown-content h2, .markdown-content h3 {
      margin-top: 2.2rem;
      margin-bottom: 1.2rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.4;
    }

    .markdown-content h2 {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
    }

    .markdown-content h2::before {
      content: "";
      width: 4px;
      height: 1.3rem;
      background: linear-gradient(to bottom, #6366f1, #a855f7);
      margin-right: 10px;
      border-radius: 10px;
    }

    .dark .markdown-content h1, .dark .markdown-content h2 { color: #f1f5f9; }

    /* 引用块 (Blockquote)：卡片化处理 */
    .markdown-content blockquote {
      margin: 1.5rem 0;
      padding: 1.2rem 1.5rem;
      background-color: #f8fafc;
      border-left: 5px solid #6366f1;
      border-radius: 4px 12px 12px 4px;
      color: #475569;
    }
    .dark .markdown-content blockquote {
      background-color: rgba(30, 41, 59, 0.5);
      color: #94a3b8;
    }

    /* 列表优化：增加层级呼吸感 */
    .markdown-content ul, .markdown-content ol {
      margin: 1.2rem 0;
      padding-left: 1.8rem;
    }
    .markdown-content li {
      margin-bottom: 0.8rem;
    }
    /* 列表内的空格感 */
    .markdown-content li > p { margin: 0.4rem 0; }

    /* 强重点强调：使用柔和底色而非单纯加粗 */
    .markdown-content strong {
      color: #4f46e5;
      background: rgba(99, 102, 241, 0.08);
      padding: 0 4px;
      margin: 0 2px;
      border-radius: 4px;
      font-weight: 600;
    }
    .dark .markdown-content strong {
      color: #a5b4fc;
      background: rgba(165, 180, 252, 0.15);
    }

    /* 表格深度美化：适配宽屏滚动 */
    .markdown-content table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 2rem 0;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      overflow: hidden;
      display: block;
      overflow-x: auto; /* 保证手机端可滑动 */
    }

    .markdown-content th {
      background-color: #f8fafc;
      font-weight: 600;
      padding: 1rem;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
      white-space: nowrap;
    }

    .markdown-content td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      line-height: 1.6;
    }
    .dark .markdown-content table { border-color: #334155; }
    .dark .markdown-content th { background-color: #1e293b; border-bottom-color: #334155; }
    .dark .markdown-content td { border-bottom-color: #334155; }

    /* 行内代码 */
    .markdown-content code {
      padding: 0.2rem 0.5rem;
      background-color: #f1f5f9;
      color: #be185d;
      border-radius: 6px;
      font-family: 'Consolas', monospace;
      font-size: 0.9em;
      margin: 0 2px;
    }
    .dark .markdown-content code { background-color: #1e293b; color: #f472b6; }

    /* 代码块 */
    .markdown-content pre {
      padding: 1.5rem;
      margin: 1.5rem 0;
      background-color: #0f172a;
      border-radius: 12px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    /* 分割线 */
    .markdown-content hr {
      margin: 3rem 0;
      border: 0;
      border-top: 2px dashed #e2e8f0;
    }
    .dark .markdown-content hr { border-top-color: #334155; }
  `
}

export const injectMarkdownStyles = (containerId?: string): void => {
  const styleId = containerId ? `markdown-styles-${containerId}` : 'markdown-styles'
  if (document.getElementById(styleId)) return

  const styleElement = document.createElement('style')
  styleElement.id = styleId
  const css = getMarkdownStyles()

  styleElement.textContent = containerId
    ? css.replace(/\.markdown-content/g, `#${containerId} .markdown-content`)
    : css

  document.head.appendChild(styleElement)
}
