import axios from 'axios'
import { getToken } from './util/authUtil'

const request = axios.create({
  // 根据运行环境行设置不同的 baseURL
  baseURL: import.meta.env.VITE_BASE_API,
  // 超时请求
  timeout: 10000,
})

// 请求拦截设置相应的token
request.interceptors.request.use((config) => {
  // 获取cookie中的token
  const token = getToken()
  // 将token添加到请求头中
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 请求拦截器响应错误处理
request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 根据后端返回的code判断请求是否成功
    if (res.code === 200) {
      return res.data // 返回业务数据
    } else {
      // 处理错误情况
      const error = new Error(res.message || '请求失败')
      ;(error as any).code = res.code
      return Promise.reject(error)
    }
  },
  (error) => {
    // 处理网络错误或其他异常
    if (error.response) {
      const res = error.response.data
      const err = new Error(res.message || '请求失败')
      ;(err as any).code = res.code
      return Promise.reject(err)
    } else {
      const err = new Error('网络错误，请检查网络连接')
      ;(err as any).code = 'NETWORK_ERROR'
      return Promise.reject(err)
    }
  },
)

export default request
