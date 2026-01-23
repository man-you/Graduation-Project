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
      parentName: 'teacheLayout',
      routes: mod.teacherChildrenRoutes,
    }
  },
}
