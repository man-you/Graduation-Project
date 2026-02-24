import request from '@/request'
import type { 
  FileResourceItem,
  CreateFileDto, 
  UpdateFileDto,
} from '@/types/file/file.type'

/**
 * 获取COS资源的预签名URL，用于前端临时访问
 * @param nodeId 数据库中资源节点的ID
 * @param method HTTP请求方法，默认get
 * @param expireTime 签名过期时间（秒），默认3600秒
 */
export const getSignedUrlApi = (
  nodeId: number, 
  method?: 'get' | 'post' | 'put' | 'delete', 
  expireTime?: number
): Promise<{ signedUrl: string }> => {
  return request({
    url: '/api/v1/tencent-cos/user/signed-url',
    method: 'get',
    params: {
      nodeId,
      method,
      expireTime
    }
  })
}

/**
 * 创建文件夹
 * @param createDto 文件夹创建信息
 */
export const createFolderApi = (createDto: CreateFileDto): Promise<any> => {
  return request({
    url: '/api/v1/tencent-cos/user/folder',
    method: 'post',
    data: createDto
  })
}

/**
 * 上传文件（返回上传URL和文件信息）
 * @param createDto 文件创建信息
 */
export const createFileApi = (createDto: CreateFileDto): Promise<any> => {
  return request({
    url: '/api/v1/tencent-cos/user/file',
    method: 'post',
    data: createDto
  })
}

/**
 * 列出目录内容
 * @param path 目录路径，可选
 */
export const listDirectoryApi = (path?: string): Promise<FileResourceItem[]> => {
  return request({
    url: '/api/v1/tencent-cos/user/list',
    method: 'get',
    params: { path }
  })
}

/**
 * 重命名文件或文件夹
 * @param updateDto 包含oldPath和newPath的更新信息
 */
export const renameResourceApi = (updateDto: UpdateFileDto): Promise<any> => {
  return request({
    url: '/api/v1/tencent-cos/user/rename',
    method: 'put',
    data: updateDto
  })
}

/**
 * 删除文件或文件夹
 * @param resourcePath 资源路径
 */
export const deleteResourceApi = (resourcePath: string): Promise<any> => {
  return request({
    url: '/api/v1/tencent-cos/user/delete',
    method: 'delete',
    params: { path: resourcePath }
  })
}