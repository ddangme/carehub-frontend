import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '@/shared/contexts/AuthContext';

/**
 * 인증된 사용자만 접근할 수 있는 라우트 컴포넌트
 */
const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 로딩 중일 때 로딩 인디케이터 표시
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;