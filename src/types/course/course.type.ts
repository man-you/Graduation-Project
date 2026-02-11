

/**
 * 课程节点类型

 */
export interface CourseNode {
  id: number;
  nodeName: string;
  nodeLevel: 'LEVEL1' | 'LEVEL2' | 'LEVEL3' | 'LEVEL4';
  description: string | null;
  order: number;
  parentNodeId: number,
  childNodes?: CourseNode[];
}




/**
 * 课程类型

 */

export interface Course {
  id: number
  title: string
  description: string
  estimatedDuration: number
  duration: number
  isCompleted: boolean
  progress?: number
}
