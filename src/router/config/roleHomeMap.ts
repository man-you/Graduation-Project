export const ROLE_ROUTE_MAP = {
  student: async () => {
    const mod = await import('@/router/module/student.routes')
    return {
      parentName: 'StudentLayout',
      routes: mod.studentChildrenRoutes,
    }
  },

  teacher: async () => {
    const mod = await import('@/router/module/teacher.routes')
    return {
      parentName: 'TeacherLayout',
      routes: mod.teacherChildrenRoutes,
    }
  },

  admin: async () => {
    const mod = await import('@/router/module/admin.routes')
    return {
      parentName: 'AdminLayout',
      routes: mod.adminChildrenRoutes,
    }
  },
}
