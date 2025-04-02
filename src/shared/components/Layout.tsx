// src/shared/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  // 헤더 높이를 계산 (반응형 디자인 고려)
  const headerHeight = { xs: '30px', sm: '50px' };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* 헤더 컨테이너 - 자연스러운 그림자 효과 적용 */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1100,
          bgcolor: 'background.paper',
          // 더 자연스러운 그림자 효과로 변경
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05)',
          // 대안: 경계선 사용
          // borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          <Box sx={{ maxWidth: '1500px', width: '100%' }}>
            <Header />
          </Box>
        </Box>
      </Box>

      {/* 메인 컨텐츠 영역 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexGrow: 1,
          width: '100%',
          mt: headerHeight,
        }}
      >
        <Box
          component="main"
          sx={{
            maxWidth: '900px',
            width: '100%',
            px: { xs: 2, sm: 3, md: 4 },
            py: 4,
          }}
        >
          <Outlet />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Box sx={{ maxWidth: '900px', width: '100%' }}>
          <Footer />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;