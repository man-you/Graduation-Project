import request from '@/request';
import type { PPTTemplateList, CreatePPTRequest, CreatePPTResponse, PPTProgressResponse } from '@/types/ppt.type';

// 获取PPT模板列表
export const getPPTTemplates = (): Promise<PPTTemplateList> => {
  return request({
    url: '/api/v1/ppts/templates',
    method: 'post',
  });
};

// 创建PPT - 根据实际响应结构，返回包含 sid 属性的对象
export const createPPT = (data: CreatePPTRequest): Promise<{ sid: string }> => {
  return request({
    url: '/api/v1/ppts',
    method: 'post',
    data,
  });
};

// 查询PPT生成进度
export const getPPTProgress = (sid: string): Promise<PPTProgressResponse> => {
  return request({
    url: `/api/v1/ppts/progress/${sid}`,
    method: 'get',
  });
};
