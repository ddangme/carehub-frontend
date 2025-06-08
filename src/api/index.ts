// src/api/index.ts
import apiClient from './apiClient';
import authApi from './authApi';
import kakaoApi from './kakaoApi';
import careSubjectApi from './careSubjectApi';
import careRecordApi from './careRecordApi';

export {
  apiClient,
  authApi,
  kakaoApi,
  careSubjectApi,
  careRecordApi,
};

export default {
  auth: authApi,
  kakao: kakaoApi,
  careSubject: careSubjectApi,
  careRecord: careRecordApi,
};
