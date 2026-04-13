export interface Resource {
  id: number;
  resourceName: string;
  resourceType: string;
  fileSize: number;
  fileFormat: string;
  signedUrl?: string | null; // 腾讯云签名链接
}

export interface CourseNode {
  id: number;
  nodeName: string;
  nodeLevel: 'LEVEL1' | 'LEVEL2' | 'LEVEL3' | 'LEVEL4';
  description: string | null;
  order: number;
  parentNodeId?: number | null;
  childNodes?: CourseNode[];
  resource?: Resource | null; // 仅 LEVEL4 节点拥有
}

export interface Course {
  id: number;
  title: string;
  description: string;
  estimatedDuration: number;
  duration: number;
  isCompleted: boolean;
  progress?: number;
}