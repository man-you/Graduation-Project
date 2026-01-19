import request from '@/request'
export const loginApi = (credentials: { email: string; password: string }): Promise<any> => {
  return request({
    url: '/api/v1/auth/login',
    method: 'post',
    data: credentials,
  })
}

export const getUserInfoApi = (): Promise<any> => {
  return request({
    url: '/api/v1/auth/profile',
    method: 'get',
  })
}

export const registerApi = (credentials: {
  email: string
  password: string
  role: string
}): Promise<any> => {
  return request({
    url: '/api/v1/auth/register',
    method: 'post',
    data: credentials,
  })
}
