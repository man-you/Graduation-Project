export type NodeLevel = 'LEVEL1' | 'LEVEL2' | 'LEVEL3' | 'LEVEL4';

export const LEVEL_CONFIG = {
  LEVEL1: { label: '课程', color: 'bg-blue-500/10 text-blue-600 border-blue-200' },
  LEVEL2: { label: '章节', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' },
  LEVEL3: { label: '知识小节', color: 'bg-amber-500/10 text-amber-600 border-amber-200' },
  LEVEL4: { label: '知识点', color: 'bg-purple-500/10 text-purple-600 border-purple-200' },
};

export interface CreateNodeDto {
  nodeName: string;
  nodeLevel: NodeLevel;
  description?: string | null;
  estimatedDuration?: number | null;
  parentNodeId?: number | null;
  courseId: number;
}

export interface UpdateNodeDto {
  nodeName?: string;
  description?: string | null;
  estimatedDuration?: number | null;
}

export interface FlatNode {
  id: number;
  nodeName: string;
  nodeLevel: NodeLevel;
  description: string | null;
  parentNodeId: number | null;
  depth: number;
  hasChildren: boolean;
  isExpanded: boolean;
}
