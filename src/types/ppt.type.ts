export interface PPTTemplateDetailImage {
  titleCoverImageLarge: string;
  titleCoverImage: string;
  catalogueCoverImage: string;
  chapterCoverImage: string;
  contentCoverImage: string;
  endCoverImage: string;
}

export interface PPTTemplate {
  templateIndexId: string;
  industry: string;
  style: string;
  detailImage: string;
  color: string;
}

export interface PPTTemplateList {
  flag: boolean;
  code: number;
  desc: string;
  data: {
    total: number;
    records: PPTTemplate[];
  };
}

// 创建PPT请求DTO
export interface CreatePPTRequest {
  prompt: string;
  templateId: string;
  businessId?: string;
  author?: string;
  isFigure?: boolean;
}

// 创建PPT响应
export interface CreatePPTResponse {
    sid: string;
}

// PPT进度查询响应 - 更新为匹配实际后端返回的结构
export interface PPTProgressResponse {
  data: {
    pptStatus: 'building' | 'done' | 'build_failed';
    aiImageStatus: 'building'  | 'done';
    cardNoteStatus: 'building' |  'done' ;
    pptUrl?: string;
    errMsg?: string;
    totalPages: number;
    donePages: number;
  }
}
