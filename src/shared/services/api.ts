import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response 인터셉터
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // 401 에러 처리 (인증 만료)
        if (error.response && error.response.status === 401) {
            // 토큰 갱신 로직 또는 로그아웃 처리
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;