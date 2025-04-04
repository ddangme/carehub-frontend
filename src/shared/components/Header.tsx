import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, useMediaQuery,
  useTheme, IconButton, Badge
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login');
  };

  const categories = [
    { name: "케어 기록", path: "/care-activities" },
    { name: "케어 대상", path: "/care-subjects" },
    { name: "일정 관리", path: "/schedules" },
    { name: "건강 데이터", path: "/health-data" }
  ];

  // 현재 활성화된 카테고리 확인
  const getActiveCategoryIndex = () => {
    return categories.findIndex(category =>
      location.pathname.startsWith(category.path)
    );
  };

  const activeCategoryIndex = getActiveCategoryIndex();

  return (
    <Box sx={{ width: '100%' }}>
      {/* 상단 헤더 (로고와 아이콘) */}
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid #e0e0e0' }}
      >
        <Toolbar sx={{
          px: 2,
          height: { xs: '48px', sm: '56px' },
          minHeight: { xs: '48px', sm: '56px' }
        }}>
          {/* 로고 영역 */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              flexShrink: 0,
              width: '120px'
            }}
          >
            Care Hub
          </Typography>

          {/* 데스크탑에서만 내비게이션이 상단에 표시됨 */}
          {!isMobile && (
            <Box sx={{
              display: 'flex',
              marginLeft: 4,
              flex: '1 1 auto'
            }}>
              {categories.map((category, index) => (
                <Button
                  key={index}
                  component={RouterLink}
                  to={category.path}
                  color={activeCategoryIndex === index ? "primary" : "inherit"}
                  sx={{
                    mx: 1,
                    fontWeight: activeCategoryIndex === index ? 700 : 400,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.8
                    }
                  }}
                >
                  {category.name}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: isMobile ? 1 : 0 }} />

          {/* 아이콘 영역 */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '120px'
          }}>
            <Badge
              badgeContent={2}
              color="error"
              sx={{
                mr: 2,
                '& .MuiBadge-badge': {
                  fontSize: '10px',
                  height: '16px',
                  minWidth: '16px'
                }
              }}
            >
              <IconButton
                color="inherit"
                size="small"
                sx={{ padding: 0.5 }}
              >
                <ShoppingCartIcon sx={{ fontSize: '1.25rem' }} />
              </IconButton>
            </Badge>

            <IconButton
              color="inherit"
              size="small"
              sx={{
                mr: 2,
                padding: 0.5
              }}
            >
              <SearchIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>

            <IconButton
              color="inherit"
              size="small"
              onClick={handleLogin}
              sx={{ padding: 0.5 }}
            >
              <PersonIcon sx={{ fontSize: '1.25rem' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 모바일에서만 내비게이션이 아래로 내려감 */}
      {isMobile && (
        <Box sx={{
          borderBottom: '1px solid #e0e0e0',
          width: '100%',
          overflowX: 'auto',
          display: 'flex',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none'
        }}>
          {categories.map((category, index) => (
            <Button
              key={index}
              component={RouterLink}
              to={category.path}
              color={activeCategoryIndex === index ? "primary" : "inherit"}
              sx={{
                py: 1,
                px: 2,
                flexShrink: 0,
                flexGrow: 1,
                textAlign: 'center',
                borderRadius: 0,
                minWidth: { xs: '80px', sm: '100px' },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                borderBottom: activeCategoryIndex === index ?
                  `2px solid ${theme.palette.primary.main}` : 'none',
                fontWeight: activeCategoryIndex === index ? 700 : 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  opacity: 0.8
                }
              }}
            >
              {category.name}
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Header;