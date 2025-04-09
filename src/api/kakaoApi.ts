import apiClient from './apiClient';
import { TokenResponse } from './authApi';

// 카카오 로그인 관련 API 함수
const kakaoApi = {
  /**
   * 카카오 인증 코드로 로그인
   * @param code 인증 코드
   * @param deviceId 기기 식별자 (선택)
   * @param fcmToken FCM 토큰 (선택)
   * @returns 인증 토큰 정보
   */
  loginWithKakao: async (code: string, deviceId?: string, fcmToken?: string): Promise<TokenResponse> => {
    return await apiClient.get(`/v1/auth/kakao/callback?code=${code}&deviceId=${deviceId || ''}&fcmToken=${fcmToken || ''}`);
  },

  /**
   * 카카오 로그인 URL 생성
   * @returns 카카오 인증 페이지 URL
   */
  getKakaoLoginUrl: (): string => {
    const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const REDIRECT_URI = encodeURIComponent(import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:3000/auth/kakao/callback');
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

    return KAKAO_AUTH_URL;
  }
};

export default kakaoApi;