import {
  PhChartLine,
  PhTreeStructure,
  PhCalendarBlank,
  PhNotePencil,
  PhBooks,
} from '@phosphor-icons/vue'

export interface MenuItem {
  id: number
  title: string
  icon: any
  weight: 'fill' | 'regular'
  isActive: boolean
  path?: string
}

// 菜单列表源数据
export const menuList: MenuItem[] = [
  {
    id: 1,
    title: '学习总览',
    icon: PhChartLine,
    weight: 'fill',
    isActive: true,
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
    title: '知识图谱',
    icon: PhTreeStructure,
    weight: 'regular',
    isActive: true,
  },
  {
    id: 4,
    title: '学习计划',
    icon: PhCalendarBlank,
    weight: 'regular',
    isActive: true,
  },
  {
    id: 5,
    title: '我的笔记',
    icon: PhNotePencil,
    weight: 'regular',
    isActive: true,
  },
]
