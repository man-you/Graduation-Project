import request from '@/request'
import type {
  FileResourceItem,
  CreateFileDto,
  UpdateFileDto,
  BindResourceDto,
} from '@/types/file.type'

/**
 * 获取COS资源的预签名URL，用于前端临时访问
 * @param nodeId 数据库中资源节点的ID（用于个人资源）
 * @param fileId 文件ID（用于课程资源）
 * @param method HTTP请求方法，默认get
 * @param expireTime 签名过期时间（秒），默认3600秒
 */
export const getSignedUrlApi = (
  nodeId?: number,
  fileId?: number,
  method?: 'get' | 'post' | 'put' | 'delete',
  expireTime?: number
): Promise<string> => {
  // 构建参数对象，只包含有值的参数
  const params: {
    nodeId?: number;
    fileId?: number;
    method?: string;
    expireTime?: number
  } = {};

  // 只有当参数有实际值时才添加到params中
  if (nodeId !== undefined && nodeId !== null) {
    params.nodeId = nodeId;
  }

  if (fileId !== undefined && fileId !== null) {
    params.fileId = fileId;
  }

  if (method !== undefined) {
    params.method = method;
  }

  if (expireTime !== undefined) {
    params.expireTime = expireTime;
  }

  return request({
    url: '/api/v1/tencent-cos/signed-url',
    method: 'get',
    params
  });
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
 * 绑定已有资源到节点
 * @param bindData 可以是 BindResourceDto 对象或包含文件的 FormData
 */
export const bindResourceApi = (data: BindResourceDto): Promise<any> => {
  return request({
    url: '/api/v1/tencent-cos/teacher/resource',
    method: 'post',
    data
  })
}

/**
 * 列出目录内容
 * @param path 目录路径，可选
 */
/**
 * 获取目录列表
 * @param path 当前路径
 * @param userRole 用户角色 (从 authStore 获取)
 */
export const listDirectoryApi = (
  path?: string,
): Promise<FileResourceItem[]> => {
  return request({
    url: '/api/v1/tencent-cos/user/list',
    method: 'get',
    params: {
      path
    }
  })
}
/**
 * 列出目录内容
 * @param path 目录路径，可选
 */
/**
 * 获取目录列表
 * @param path 当前路径
 * @param userRole 用户角色 (从 authStore 获取)
 */
export const listPublicApi = (
  path?: string,
  courseId?: number
): Promise<FileResourceItem[]> => {
  return request({
    url: '/api/v1/tencent-cos/course/list',
    method: 'get',
    params: {
      path,
      courseId
    }
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
export const deleteResourceApi = (resourcePath: string, courseId?: number): Promise<any> => {
  // 构建参数对象
  const params: { path: string; courseId?: number } = { path: resourcePath };

  if (courseId !== undefined && courseId !== null) {
    params.courseId = courseId;
  }

  return request({
    url: '/api/v1/tencent-cos/user/delete',
    method: 'delete',
    params
  });
}


