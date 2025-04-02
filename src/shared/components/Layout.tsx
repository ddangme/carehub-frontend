// src/shared/components/Layout.tsx
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Box sx={{ maxWidth: '1500px', width: '100%' }}>
          <Header />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexGrow: 1,
          width: '100%',
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