import apiClient from './apiClient';
import authApi from './authApi';
import kakaoApi from './kakaoApi';

export {
  apiClient,
  authApi,
  kakaoApi,
};

export default {
  auth: authApi,
  kakao: kakaoApi,
};