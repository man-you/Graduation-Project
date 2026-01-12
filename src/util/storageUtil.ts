/* 
    存储工具函数 
*/

/*
    浏览器长期存储相关函数 
 */

// 设置浏览器长期存储
export const setLocalStorage = (key: string, value: string) => {
  try {
    // 如果是一个对象，先转为字符串然后进行存储
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value))
    } else {
      localStorage.setItem(key, value)
    }
  } catch (error) {
    console.error('设置本地存储失败:', error)
  }
}

// 获取浏览器长期存储
export const getLocalStorage = (key: string): any => {
  try {
    const value = localStorage.getItem(key)
    if (!value) {
      return null
    } else {
      // 尝试解析为JSON对象
      return JSON.parse(value)
    }
  } catch (error) {
    console.error('获取 localStorage 失败:', error)
    return null
  }
}

// 移除浏览器长期存储
export const removeLocalStorage = (key: string) => {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error('移除 localStorage 失败:', err)
  }
}
// 清除浏览器长期存储
export const clearLocalStorage = () => {
  try {
    localStorage.clear()
  } catch (err) {
    console.error('清除 localStorage 失败:', err)
  }
}

/* 
    会话存储相关函数
 */

// 设置本地会话存储
export const setSessionStorage = (key: string, value: string) => {
  try {
    if (typeof value === 'object') {
      sessionStorage.setItem(key, JSON.stringify(value))
    } else {
      sessionStorage.setItem(key, value)
    }
  } catch (err) {
    console.error('设置会话存储失败:', err)
  }
}

// 获取本地会话存储
export const getSessionStorage = (key: string): any => {
  try {
    const value = sessionStorage.getItem(key)
    if (!value) {
      return null
    } else {
      return JSON.parse(value)
    }
  } catch (err) {
    console.error('获取 sessionStorage 失败:', err)
    return null
  }
}
// 移除本地会话存储
export const removeSessionStorage = (key: string) => {
  try {
    sessionStorage.removeItem(key)
  } catch (err) {
    console.error('移除 sessionStorage 失败:', err)
  }
}

// 清除本地会话存储
export const clearSessionStorage = () => {
  try {
    sessionStorage.clear()
  } catch (err) {
    console.error('清除 sessionStorage 失败:', err)
  }
}
