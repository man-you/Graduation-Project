import { PhFolder, PhTreeStructure, PhChat, PhBooks, PhGear } from '@phosphor-icons/vue'

export interface MenuItem {
  id: number
  title: string
  icon: any
  weight: 'fill' | 'regular'
  isActive: boolean
  path?: string
  roles?: string[]
  pathMap?: Record<string, string>
}

// 菜单列表源数据
export const menuList: MenuItem[] = [
  {
    id: 1,
    title: '知识图谱',
    icon: PhTreeStructure,
    weight: 'regular',
    isActive: true,
    roles: ['teacher', 'student'],
  },
  {
    id: 2,
    title: '我的课程',
    icon: PhBooks,
    weight: 'regular',
    isActive: true,
  },
  {
    id: 3,
    title: '文件管理',
    icon: PhFolder,
    weight: 'regular',
    isActive: true,
    path: '/files',
    roles: ['teacher', 'student'],
    pathMap: {
      student: '/student/files',
      teacher: '/teacher/files',
    },
  },
  {
    id: 4,
    title: '知链助手',
    icon: PhChat,
    weight: 'regular',
    isActive: true,
    path: '/assistant',
    roles: ['teacher', 'student'],
    pathMap: {
      student: '/student/assistant',
      teacher: '/teacher/assistant',
    },
  },
  {
    id: 5,
    title: '设置',
    icon: PhGear,
    weight: 'regular',
    isActive: true,
    path: '/setting',
    roles: ['teacher', 'student'],
    pathMap: {
      student: '/student/settings',
      teacher: '/teacher/settings',
    },
  },
]
