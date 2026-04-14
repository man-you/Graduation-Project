export type FileType = 'VIDEO' | 'PDF'

/**
 * 文件或文件夹资源项（API返回的实际格式）
 */
export interface FileResourceItem {
  id: string
  resourceName: string
  resourcePath: string
  resourceType: 'FILE' | 'FOLDER'
  fileSize: string | null
  fileFormat: string | null
  isPublic?: boolean
}

/**
 * 文件或文件夹项的基本信息
 */
export interface FileItem {
  id: string
  name: string
  type: string
  contents: string
  path?: string
  resourceType?: 'FILE' | 'FOLDER'
}

/**
 * 目录路径导航项
 */
export interface DirectoryPath {
  id: string
  name: string
}

/**
 * 创建文件或文件夹的请求数据
 */
export interface CreateFileDto {
  resourceName: string
  resourcePath?: string
  resourceType: 'FILE' | 'FOLDER'
  parentPath?: string
  fileSize?: string
  fileFormat?: string
  isPublic?: boolean
  courseId?: number
}
/**
 * 节点绑定资源
 */
export interface BindResourceDto {
  resourceName: string
  resourceType: FileType
  fileSize: string
  fileFormat: string
  nodeId: number
}

/**
 * 更新文件或文件夹的请求数据（用于重命名等操作）
 */
export interface UpdateFileDto {
  oldPath: string
  newPath: string
  courseId?: number
}

/**
 * 目录列表响应数据
 */
export interface DirectoryListResponse {
  folders: FileResourceItem[]
  files: FileResourceItem[]
  path: DirectoryPath[]
}
