// user模拟数据，实现路由鉴权的操作
export const loginApi = (credentials: { email: string; password: string }): Promise<any> => {
  //   return request({
  //     url: '/auth/login',
  //     method: 'post',
  //     data: credentials,
  //   })

  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟用户数据
      resolve({
        data: {
          code: 200,
          message: '登录成功',
          token: 'accessToken' + Math.random().toString(36).substring(2),
          userInfo: {
            id: 1,
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'student', // 角色信息，用于权限控制
            avatar: '',
            createTime: new Date().toISOString(),
          },
        },
      })
    }, 500) // 模拟500ms延迟
  })
}

export const getUserInfoApi = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          code: 200,
          message: '获取用户信息成功',
          userInfo: {
            id: 1,
            name: '张三',
            email: 'zhangsan@example.com',
            role: 'student',
            avatar: '',
            createTime: new Date().toISOString(),
          },
        },
      })
    }, 300) // 模拟300ms延迟
  })
}
