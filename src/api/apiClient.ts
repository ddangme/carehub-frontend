import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';

// API 기본 설정
const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
const API_TIMEOUT = 30000; // 30초

// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
  };
}

// API 클라이언트 클래스
class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.client = axios.create({
      baseURL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 설정
    this.client.interceptors.request.use(
      (config) => {
        // 토큰이 필요한 요청에 JWT 추가
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 응답 인터셉터 설정
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // 401 에러이고 토큰 만료인 경우 리프레시 토큰으로 갱신 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
          // 여기에 리프레시 토큰 로직 구현
          // originalRequest._retry = true;
          // 토큰 갱신 후 원래 요청 재시도
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  // 에러 핸들링 메서드
  private handleError(error: AxiosError): Error {
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태 코드인 경우
      const serverError = error.response.data as any;
      return new Error(
        serverError.error?.message || '서버 오류가 발생했습니다.'
      );
    } else if (error.request) {
      // 요청이 전송되었지만 응답이 없는 경우
      return new Error('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
    } else {
      // 요청 설정 중 에러가 발생한 경우
      return new Error('요청 중 오류가 발생했습니다.');
    }
  }

  // GET 요청
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // POST 요청
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // PUT 요청
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // PATCH 요청
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data, config);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  // DELETE 요청
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

// API 클라이언트 싱글톤 인스턴스 생성
const apiClient = new ApiClient();
export default apiClient;