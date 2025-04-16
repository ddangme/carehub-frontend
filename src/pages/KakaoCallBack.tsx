import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';

const KakaoCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // sessionStorage를 사용해 이미 처리했는지 확인
    const processed = sessionStorage.getItem('kakao_callback_processed');
    if (processed) {
      setError('이미 처리된 요청입니다.');
      setLoading(false);
      return;
    }

    const code = searchParams.get('code');
    if (!code) {
      setError('카카오 인증 코드가 없습니다.');
      setLoading(false);
      return;
    }

    // 처리 중임을 표시
    sessionStorage.setItem('kakao_callback_processed', 'true');

    const handleKakaoCallback = async () => {
      try {
        // 전체 URL 사용
        const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
        const response = await fetch(`${apiBaseUrl}/v1/auth/kakao/callback?code=${code}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          const responseText = await response.text();
          console.error('Error response:', responseText);

          try {
            // JSON으로 파싱 시도
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.error?.message || `서버 오류: ${response.status}`);
          } catch (jsonError) {
            // JSON 파싱 실패 시
            throw new Error(`서버 응답 오류: ${response.status}`);
          }
        }

        const result = await response.json();
        if (result.success) {
          // 로그인 성공 처리
          localStorage.setItem('access_token', result.data.accessToken);
          localStorage.setItem('refresh_token', result.data.refreshToken);
          localStorage.setItem('user_info', JSON.stringify(result.data.userInfo));
          navigate('/', { replace: true });
        } else {
          throw new Error(result.error?.message || '카카오 로그인 처리 실패');
        }
      } catch (err: any) {
        console.error('Kakao login error:', err);
        setError(err.message || '카카오 로그인 처리 중 오류가 발생했습니다.');
        setLoading(false);
        // 실패 시 processed 플래그 제거
        sessionStorage.removeItem('kakao_callback_processed');
      }
    };

    handleKakaoCallback();

    // 컴포넌트 언마운트 시 클린업
    return () => {
      // 페이지 이동 시 플래그 제거
      sessionStorage.removeItem('kakao_callback_processed');
    };
  }, [navigate, searchParams]);

  const goToLogin = () => {
    sessionStorage.removeItem('kakao_callback_processed');
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ textAlign: 'center', my: 4, p: 2 }}>
      {error ? (
        <>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={goToLogin}
          >
            로그인 페이지로 돌아가기
          </Button>
        </>
      ) : (
        loading && (
          <>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="h6">
              카카오 로그인 처리 중...
            </Typography>
          </>
        )
      )}
    </Box>
  );
};

export default KakaoCallback;