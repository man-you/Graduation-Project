/**
 * 文件或文件夹资源项（API返回的实际格式）
 */
export interface FileResourceItem {
  resourceName: string
  resourcePath: string
  resourceType: 'FILE' | 'FOLDER'
  fileSize: string | null
  fileFormat: string | null
  id?: string
}

/**
 * 文件或文件夹项的基本信息（前端展示格式）
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
}

/**
 * 更新文件或文件夹的请求数据（用于重命名等操作）
 */
export interface UpdateFileDto {
  oldPath?: string
  newPath?: string
  resourceName?: string
  resourcePath?: string
  resourceType?: 'FILE' | 'FOLDER'
  parentPath?: string
  fileSize?: string
  fileFormat?: string
}

/**
 * 目录列表响应数据
 */
export interface DirectoryListResponse {
  folders: FileResourceItem[]
  files: FileResourceItem[]
  path: DirectoryPath[]
}