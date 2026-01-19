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
    return response.data
  },
  (error) => Promise.reject(error),
)

export default request
