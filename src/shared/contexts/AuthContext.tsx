import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi, { TokenResponse, UserInfo } from '@/api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserInfo | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  verificationToken: string;
}

// 로컬 스토리지 키
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';
const DEVICE_ID_KEY = 'device_id';

// 디바이스 ID 생성
const generateDeviceId = () => {
  return Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
};

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// 인증 상태를 제공하는 Provider 컴포넌트
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  // 디바이스 ID 확인 또는 생성
  useEffect(() => {
    if (!localStorage.getItem(DEVICE_ID_KEY)) {
      localStorage.setItem(DEVICE_ID_KEY, generateDeviceId());
    }
  }, []);

  // 앱 시작 시 자동 로그인 시도
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      const userInfoStr = localStorage.getItem(USER_INFO_KEY);

      if (!accessToken || !refreshToken) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        // 사용자 정보가 있으면 상태 업데이트
        if (userInfoStr) {
          const userInfo = JSON.parse(userInfoStr) as UserInfo;
          setUser(userInfo);
          setIsAuthenticated(true);
        }

        // 토큰 갱신 필요 여부 확인 (선택적)
        // 여기서 토큰이 만료되었는지 확인하고 필요시 갱신 로직 추가

      } catch (error) {
        console.error('자동 로그인 실패:', error);
        // 로그인 정보 초기화
        handleLogout(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [navigate]);

  // 로그인 처리
  const handleLogin = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);

    try {
      const deviceId = localStorage.getItem(DEVICE_ID_KEY) || generateDeviceId();
      const response = await authApi.login(email, password, deviceId);

      // 토큰 및 사용자 정보 저장
      saveAuthData(response);

      setIsAuthenticated(true);
      setUser(response.userInfo);

      // 홈으로 리다이렉트
      navigate('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 처리
  const handleLogout = async (callApi: boolean = true): Promise<void> => {
    setIsLoading(true);

    try {
      if (callApi) {
        const deviceId = localStorage.getItem(DEVICE_ID_KEY);
        await authApi.logout(deviceId || undefined);
      }
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 로컬 스토리지에서 인증 정보 제거
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_INFO_KEY);

      // 디바이스 ID는 유지 (재접속시 같은 기기로 식별)

      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);

      // 로그인 페이지로 리다이렉트
      navigate('/login');
    }
  };

  // 회원가입 처리
  const handleRegister = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);

    try {
      await authApi.register(data);
      // 회원가입 후 자동 로그인 (선택적)
      // await handleLogin(data.email, data.password);
    } catch (error) {
      console.error('회원가입 실패:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 데이터 저장
  const saveAuthData = (response: TokenResponse) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(response.userInfo));
  };

  // 컨텍스트 값
  const value = {
    isAuthenticated,
    isLoading,
    user,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 커스텀 훅: 인증 컨텍스트 사용
export const useAuth = () => useContext(AuthContext);

export default AuthContext;