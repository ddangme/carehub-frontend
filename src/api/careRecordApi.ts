// src/api/careRecordApi.ts
import apiClient from './apiClient';

// 케어 기록 유형 enum
export enum CareRecordType {
  FEEDING = 'FEEDING',
  SLEEP = 'SLEEP',
  DIAPER = 'DIAPER',
  HEALTH = 'HEALTH',
  ACTIVITY = 'ACTIVITY',
  OTHER = 'OTHER'
}

// 케어 기록 생성 요청 인터페이스
export interface CareRecordCreateRequest {
  careSubjectId: number;
  recordType: CareRecordType;
  title: string;
  description?: string;
  recordedAt: string; // ISO 날짜 문자열
  recordData?: Record<string, any>;
}

// 케어 기록 수정 요청 인터페이스
export interface CareRecordUpdateRequest {
  title?: string;
  description?: string;
  recordedAt?: string;
  recordData?: Record<string, any>;
}

// 케어 기록 응답 인터페이스
export interface CareRecordResponse {
  id: number;
  careSubjectId: number;
  careSubjectName: string;
  recordType: CareRecordType;
  recordTypeDisplayName: string;
  title: string;
  description?: string;
  recordedAt: string;
  recordData: Record<string, any>;
  recordedByName: string;
  recordedById: number;
  createdAt: string;
  updatedAt: string;
}

// 페이지네이션 응답 인터페이스
export interface CareRecordPageResponse {
  content: CareRecordResponse[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

// 케어 기록 조회 파라미터
export interface CareRecordQueryParams {
  careSubjectId: number;
  recordType?: CareRecordType;
  startDate?: string;
  endDate?: string;
  page?: number;
  size?: number;
}

// 케어 기록 API 함수 모음
const careRecordApi = {
  /**
   * 케어 기록 생성
   */
  createCareRecord: async (data: CareRecordCreateRequest): Promise<CareRecordResponse> => {
    return await apiClient.post('/v1/care-records', data);
  },

  /**
   * 케어 기록 목록 조회
   */
  getCareRecords: async (params: CareRecordQueryParams): Promise<CareRecordPageResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append('careSubjectId', params.careSubjectId.toString());

    if (params.recordType) {
      queryParams.append('recordType', params.recordType);
    }
    if (params.startDate) {
      queryParams.append('startDate', params.startDate);
    }
    if (params.endDate) {
      queryParams.append('endDate', params.endDate);
    }
    if (params.page !== undefined) {
      queryParams.append('page', params.page.toString());
    }
    if (params.size !== undefined) {
      queryParams.append('size', params.size.toString());
    }

    return await apiClient.get(`/v1/care-records?${queryParams.toString()}`);
  },

  /**
   * 케어 기록 상세 조회
   */
  getCareRecord: async (id: number): Promise<CareRecordResponse> => {
    return await apiClient.get(`/v1/care-records/${id}`);
  },

  /**
   * 케어 기록 수정
   */
  updateCareRecord: async (id: number, data: CareRecordUpdateRequest): Promise<CareRecordResponse> => {
    return await apiClient.put(`/v1/care-records/${id}`, data);
  },

  /**
   * 케어 기록 삭제
   */
  deleteCareRecord: async (id: number): Promise<void> => {
    return await apiClient.delete(`/v1/care-records/${id}`);
  },

  /**
   * 최근 케어 기록 조회 (대시보드용)
   */
  getRecentCareRecords: async (careSubjectId: number, limit: number = 10): Promise<CareRecordResponse[]> => {
    return await apiClient.get(`/v1/care-records/recent?careSubjectId=${careSubjectId}&limit=${limit}`);
  }
};

// 기록 유형 표시명 매핑
export const recordTypeDisplayMap: Record<CareRecordType, string> = {
  [CareRecordType.FEEDING]: '식사',
  [CareRecordType.SLEEP]: '수면',
  [CareRecordType.DIAPER]: '기저귀',
  [CareRecordType.HEALTH]: '건강',
  [CareRecordType.ACTIVITY]: '활동',
  [CareRecordType.OTHER]: '기타'
};

// 기록 유형별 아이콘 매핑 (Material-UI 아이콘 이름)
export const recordTypeIconMap: Record<CareRecordType, string> = {
  [CareRecordType.FEEDING]: 'Restaurant',
  [CareRecordType.SLEEP]: 'Bedtime',
  [CareRecordType.DIAPER]: 'ChildCare',
  [CareRecordType.HEALTH]: 'HealthAndSafety',
  [CareRecordType.ACTIVITY]: 'SportsEsports',
  [CareRecordType.OTHER]: 'MoreHoriz'
};

// 기록 유형별 색상 매핑
export const recordTypeColorMap: Record<CareRecordType, string> = {
  [CareRecordType.FEEDING]: '#FF9800',
  [CareRecordType.SLEEP]: '#9C27B0',
  [CareRecordType.DIAPER]: '#8BC34A',
  [CareRecordType.HEALTH]: '#F44336',
  [CareRecordType.ACTIVITY]: '#2196F3',
  [CareRecordType.OTHER]: '#607D8B'
};

export default careRecordApi;
