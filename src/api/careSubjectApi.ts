import apiClient from './apiClient';

// API 엔드포인트 정의
const CARE_SUBJECTS_BASE_URL = '/v1/care-subjects';

// 케어 대상 프로필 유형
export enum ProfileType {
  DEFAULT = 'DEFAULT',
  INFANT = 'INFANT'
}

// 케어 대상 기본 정보 인터페이스
export interface CareSubjectBase {
  name: string;
  birthDate?: string;
  gender?: string;
  bloodType?: string;
  description?: string;
  profileImageUrl?: string;
  additionalCaregiverIds?: number[];
}

// 신생아 프로필 인터페이스
export interface InfantProfile extends CareSubjectBase {
  birthWeightGrams?: number;
  birthHeightCm?: number;
  headCircumferenceCm?: number;
  gestationalAgeWeeks?: number;
  deliveryType?: string;
  allergies?: string;
  specialCareNeeds?: string;
  lastCheckupDate?: string;
}

// 케어 대상 응답 인터페이스
export interface CareSubjectResponse {
  id: number;
  name: string;
  subjectType: string;
  birthDate?: string;
  gender?: string;
  bloodType?: string;
  description?: string;
  profileImageUrl?: string;
  ageYears?: number;
  ageMonths?: number;
  ageDays?: number;
  mainCaregiver: {
    id: number;
    name: string;
    email: string;
    profileImageUrl?: string;
  };
  caregivers: Array<{
    id: number;
    name: string;
    email: string;
    profileImageUrl?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// 신생아 프로필 응답 인터페이스
export interface InfantProfileResponse extends CareSubjectResponse {
  birthWeightGrams?: number;
  birthHeightCm?: number;
  headCircumferenceCm?: number;
  gestationalAgeWeeks?: number;
  deliveryType?: string;
  allergies?: string;
  specialCareNeeds?: string;
  lastCheckupDate?: string;
}

// 케어 대상 API 함수 모음
const careSubjectApi = {
  /**
   * 일반 케어 대상 생성
   */
  createCareSubject: async (data: CareSubjectBase): Promise<CareSubjectResponse> => {
    return await apiClient.post(CARE_SUBJECTS_BASE_URL, data);
  },

  /**
   * 신생아 프로필 생성
   */
  createInfantProfile: async (data: InfantProfile): Promise<InfantProfileResponse> => {
    return await apiClient.post(`${CARE_SUBJECTS_BASE_URL}/infant`, data);
  },

  /**
   * 케어 대상 목록 조회
   */
  getCareSubjects: async (page: number = 0, size: number = 10): Promise<{
    content: CareSubjectResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    try {
      const response = await apiClient.get(`${CARE_SUBJECTS_BASE_URL}?page=${page}&size=${size}`);
      return response || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page
      };
    } catch (error) {
      console.error('Failed to fetch care subjects:', error);
      // 오류 발생 시 빈 응답 반환
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page
      };
    }
  },

  /**
   * 케어 대상 상세 조회
   */
  getCareSubject: async (id: number): Promise<CareSubjectResponse> => {
    return await apiClient.get(`${CARE_SUBJECTS_BASE_URL}/${id}`);
  },

  /**
   * 신생아 프로필 목록 조회
   */
  getInfantProfiles: async (): Promise<InfantProfileResponse[]> => {
    return await apiClient.get(`${CARE_SUBJECTS_BASE_URL}/infant`);
  },

  /**
   * 신생아 프로필 상세 조회
   */
  getInfantProfile: async (id: number): Promise<InfantProfileResponse> => {
    return await apiClient.get(`${CARE_SUBJECTS_BASE_URL}/infant/${id}`);
  },

  /**
   * 케어 대상 삭제
   */
  deleteCareSubject: async (id: number): Promise<void> => {
    return await apiClient.delete(`${CARE_SUBJECTS_BASE_URL}/${id}`);
  },

  /**
   * 프로필 이미지 업로드
   */
  uploadProfileImage: async (file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    return await apiClient.post('/v1/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default careSubjectApi;