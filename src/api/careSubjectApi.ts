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
   * 일반 케어 대상 생성 (신생아 포함)
   */
  createCareSubject: async (data: CareSubjectBase): Promise<CareSubjectResponse> => {
    return await apiClient.post(CARE_SUBJECTS_BASE_URL, data);
  },

  /**
   * 신생아 프로필 생성 - 일반 케어 대상 생성과 동일
   */
  createInfantProfile: async (data: InfantProfile): Promise<InfantProfileResponse> => {
    return await apiClient.post(CARE_SUBJECTS_BASE_URL, data);
  },

  /**
   * 케어 대상 목록 조회 (페이지네이션 없이)
   */
  getCareSubjects: async (): Promise<{
    content: CareSubjectResponse[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }> => {
    try {
      const response = await apiClient.get(CARE_SUBJECTS_BASE_URL);
      // 백엔드에서 List를 반환하므로 페이지네이션 형태로 변환
      const careSubjects = Array.isArray(response) ? response : [];
      return {
        content: careSubjects,
        totalElements: careSubjects.length,
        totalPages: 1,
        size: careSubjects.length,
        number: 0
      };
    } catch (error) {
      console.error('Failed to fetch care subjects:', error);
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 0,
        number: 0
      };
    }
  },

  /**
   * 신생아 프로필 목록 조회 - 일반 목록에서 필터링
   */
  getInfantProfiles: async (): Promise<InfantProfileResponse[]> => {
    try {
      const response = await apiClient.get(CARE_SUBJECTS_BASE_URL);
      const allSubjects = Array.isArray(response) ? response : [];
      // INFANT 타입만 필터링
      return allSubjects.filter((subject: CareSubjectResponse) =>
        subject.subjectType === 'INFANT'
      ) as InfantProfileResponse[];
    } catch (error) {
      console.error('Failed to fetch infant profiles:', error);
      return [];
    }
  },

  /**
   * 케어 대상 상세 조회
   */
  getCareSubject: async (id: number): Promise<CareSubjectResponse> => {
    return await apiClient.get(`${CARE_SUBJECTS_BASE_URL}/${id}`);
  },

  /**
   * 신생아 프로필 상세 조회 - 일반 상세 조회와 동일
   */
  getInfantProfile: async (id: number): Promise<InfantProfileResponse> => {
    return await apiClient.get(`${CARE_SUBJECTS_BASE_URL}/${id}`);
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