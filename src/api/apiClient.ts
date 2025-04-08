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
  private isRefreshing = false;
  private failedQueue: any[] = [];

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
        const token = localStorage.getItem('access_token');
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
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          this.shouldRefreshToken(error)
        ) {
          if (this.isRefreshing) {
            // 이미 토큰 갱신 중이면 큐에 요청 추가
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject, request: originalRequest });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          // 토큰 갱신 시도
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            const deviceId = localStorage.getItem('device_id');

            if (!refreshToken) {
              // 리프레시 토큰이 없으면 로그아웃
              this.handleLogout();
              return Promise.reject(error);
            }

            // 토큰 갱신 API 호출
            const response = await axios.post<ApiResponse<{
              accessToken: string;
              refreshToken: string;
              expiresIn: number;
            }>>(
              `${baseURL}/v1/auth/refresh-token`,
              { refreshToken, deviceId },
              { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.success && response.data.data) {
              // 새 토큰 저장
              const { accessToken, refreshToken: newRefreshToken } = response.data.data;
              localStorage.setItem('access_token', accessToken);
              localStorage.setItem('refresh_token', newRefreshToken);

              // 원래 요청 헤더에 새 토큰 설정
              if (originalRequest && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              }

              // 실패한 요청 큐 처리
              this.processQueue(null, accessToken);

              // 원래 요청 재시도
              return this.client(originalRequest);
            } else {
              // 토큰 갱신 실패 처리
              this.processQueue(new Error('Failed to refresh token'), null);
              this.handleLogout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // 토큰 갱신 예외 처리
            this.processQueue(refreshError as Error, null);
            this.handleLogout();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  // 토큰 갱신이 필요한지 확인
  private shouldRefreshToken(error: AxiosError): boolean {
    // JWT 만료 에러 확인
    const data = error.response?.data as any;
    return data?.error?.code === 'A004' || // EXPIRED_TOKEN
      data?.error?.message?.includes('expired') ||
      data?.error?.message?.includes('만료');
  }

  // 실패한 요청 큐 처리
  private processQueue(error: Error | null, token: string | null): void {
    this.failedQueue.forEach(request => {
      if (error) {
        request.reject(error);
      } else {
        if (request.request && request.request.headers) {
          request.request.headers.Authorization = `Bearer ${token}`;
        }
        request.resolve(this.client(request.request));
      }
    });
    this.failedQueue = [];
  }

  // 로그아웃 처리
  private handleLogout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');

    // 로그인 페이지로 리다이렉트
    window.location.href = '/login';
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