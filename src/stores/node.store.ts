import { defineStore } from 'pinia'
import { getCouseNodesApi, createNodeApi, updateNodeApi, deleteNodeApi } from '@/api/course/course.api'

export const useNodeStore = defineStore('node', {
  state: () => ({
    nodes: [] as any[],
    loading: false,
    currentCourseId: null as number | null,
  }),

  actions: {
    async getNodes(courseId: number, force = false) {
      if (!force && this.currentCourseId === courseId && this.nodes.length > 0) return;
      this.loading = true;
      try {
        this.nodes = await getCouseNodesApi(courseId);
        this.currentCourseId = courseId;
      } finally {
        this.loading = false;
      }
    },

    async handleOperation(type: 'create' | 'update' | 'delete', data: any) {
      if (type === 'create') await createNodeApi(data);
      else if (type === 'update') await updateNodeApi(data.id, data.dto);
      else await deleteNodeApi(data.id);

      // 操作完成后强制刷新
      await this.getNodes(this.currentCourseId!, true);
    }
  }
})
