import apiClient from './apiClient';

// 사용자 정보 타입 정의
export interface UserInfo {
  id: number;
  email: string;
  name: string;
  profileImageUrl?: string;
}

// 토큰 응답 타입 정의
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  userInfo: UserInfo;
}

// 이메일 인증 응답 타입 정의
export interface EmailVerificationResponse {
  verified: boolean;
  verificationToken: string;
}

// 인증 관련 API 요청 모음
const authApi = {
  /**
   * 이메일 중복 확인
   * @param email 확인할 이메일
   * @returns 사용 가능한 이메일인지 여부
   */
  checkEmailAvailability: async (email: string): Promise<boolean> => {
    return await apiClient.get<boolean>(`/v1/auth/verification/email/check?email=${email}`);
  },

  /**
   * 이메일 인증 코드 발송
   * @param email 인증 코드를 받을 이메일
   */
  sendVerificationCode: async (email: string): Promise<void> => {
    return await apiClient.post('/v1/auth/verification/email/send-code', { email });
  },

  /**
   * 이메일 인증 코드 확인
   * @param email 이메일
   * @param verificationCode 인증 코드
   * @returns 인증 성공 여부와 토큰
   */
  verifyEmailCode: async (email: string, verificationCode: string): Promise<EmailVerificationResponse> => {
    return await apiClient.post('/v1/auth/verification/email/verify-code', {
      email,
      verificationCode
    });
  },

  /**
   * 회원가입
   * @param userData 사용자 회원가입 정보
   * @returns 생성된 사용자 ID
   */
  register: async (userData: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    verificationToken: string;
  }): Promise<number> => {
    return await apiClient.post('/v1/auth/register', userData);
  },

  /**
   * 로그인
   * @param email 이메일
   * @param password 비밀번호
   * @param deviceId 기기 식별자 (선택)
   * @param fcmToken FCM 토큰 (선택)
   * @returns 인증 토큰 정보
   */
  login: async (email: string, password: string, deviceId?: string, fcmToken?: string): Promise<TokenResponse> => {
    return await apiClient.post('/v1/auth/login', {
      email,
      password,
      deviceId,
      fcmToken
    });
  },

  /**
   * 토큰 갱신
   * @param refreshToken 리프레시 토큰
   * @param deviceId 기기 식별자 (선택)
   * @returns 새로운 인증 토큰 정보
   */
  refreshToken: async (refreshToken: string, deviceId?: string): Promise<TokenResponse> => {
    return await apiClient.post('/v1/auth/refresh-token', {
      refreshToken,
      deviceId
    });
  },

  /**
   * 로그아웃
   * @param deviceId 기기 식별자 (선택)
   * @returns void
   */
  logout: async (deviceId?: string): Promise<void> => {
    return await apiClient.post('/v1/auth/logout', { deviceId });
  },

  /**
   * 모든 기기에서 로그아웃
   * @returns void
   */
  logoutAll: async (): Promise<void> => {
    return await apiClient.post('/v1/auth/logout-all');
  },

  // authApi.ts 파일에 추가할 함수들입니다

  /**
   * 비밀번호 재설정 이메일 요청
   * @param email 이메일
   * @returns void
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    return await apiClient.post('/v1/auth/password-reset/request', { email });
  },

  /**
   * 비밀번호 재설정 토큰 검증
   * @param email 이메일
   * @param token 토큰
   * @returns 토큰 검증 결과
   */
  verifyPasswordResetToken: async (email: string, token: string): Promise<{ verified: boolean }> => {
    return await apiClient.post('/v1/auth/password-reset/verify-token', { email, token });
  },

  /**
   * 비밀번호 재설정
   * @param email 이메일
   * @param token 토큰
   * @param newPassword 새 비밀번호
   * @returns void
   */
  resetPassword: async (email: string, token: string, newPassword: string): Promise<void> => {
    return await apiClient.post('/v1/auth/password-reset/reset', {
      email,
      token,
      newPassword
    });
  },
};

export default authApi;