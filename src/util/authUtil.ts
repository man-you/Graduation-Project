import Cookies from 'js-cookie'

const TOKEN_KEY = 'access_token'

// cookie默认配置
const DEFAULT_COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7, // 7 天
  sameSite: 'lax', // 防止 CSRF
  secure: import.meta.env.PROD, // 仅 https
  path: '/',
}

export function getToken(): string | null {
  return Cookies.get(TOKEN_KEY) || null
}

export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, DEFAULT_COOKIE_OPTIONS)
}
export const removeToken = () => {
  Cookies.remove('accessToken', { path: '/' })
}
