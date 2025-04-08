import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, useMediaQuery,
  useTheme, IconButton, Badge, Avatar, Menu, MenuItem,
  ListItemIcon, Divider, Tooltip
} from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAuth } from '@/shared/contexts/AuthContext';

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  // 프로필 메뉴 상태 관리
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  // 메뉴 열기/닫기 핸들러
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  // 로그인 페이지로 이동
  const handleLogin = () => {
    navigate('/login');
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose(); // 메뉴 닫기
      navigate('/'); // 홈페이지로 이동
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  // 마이페이지로 이동
  const handleMyPage = () => {
    handleProfileMenuClose();
    navigate('/profile');
  };

  // 설정 페이지로 이동
  const handleSettings = () => {
    handleProfileMenuClose();
    navigate('/settings');
  };

  // 사용자의 이니셜을 얻기 위한 함수
  const getUserInitials = (): string => {
    if (!user || !user.name) return '?';

    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
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

  // 프로필 메뉴 렌더링
  const renderProfileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      open={isProfileMenuOpen}
      onClose={handleProfileMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          minWidth: 200,
          borderRadius: 2,
          mt: 1.5,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {user && (
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
            {user.email}
          </Typography>
        </Box>
      )}

      <Divider sx={{ my: 1 }} />

      <MenuItem onClick={handleMyPage}>
        <ListItemIcon>
          <AccountCircleIcon fontSize="small" color="primary" />
        </ListItemIcon>
        마이 페이지
      </MenuItem>

      <MenuItem onClick={handleSettings}>
        <ListItemIcon>
          <SettingsIcon fontSize="small" color="primary" />
        </ListItemIcon>
        설정
      </MenuItem>

      <Divider sx={{ my: 1 }} />

      <MenuItem onClick={handleLogout} sx={{ color: '#FE8269' }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" sx={{ color: '#FE8269' }} />
        </ListItemIcon>
        로그아웃
      </MenuItem>
    </Menu>
  );

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
                  sx={{
                    mx: 1,
                    color: activeCategoryIndex === index ? '#3AAA8F' : 'text.primary',
                    fontWeight: activeCategoryIndex === index ? 700 : 400,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#3AAA8F',
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

          {/* 아이콘 영역 - 인증 상태에 따라 다르게 표시 */}
          {isAuthenticated ? (
            /* 로그인된 상태 */
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
              {/* 검색 아이콘 */}
              <IconButton
                size="small"
                sx={{ mr: 1.5, padding: 0.5 }}
              >
                <SearchIcon sx={{ fontSize: '1.25rem' }} />
              </IconButton>

              {/* 알림 아이콘 */}
              <Tooltip title="알림">
                <IconButton size="small" sx={{ mr: 1.5, padding: 0.5 }}>
                  <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: '16px', minWidth: '16px' } }}>
                    <NotificationsIcon sx={{ fontSize: '1.25rem' }} />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* 프로필 아이콘/아바타 */}
              <Tooltip title="계정 설정">
                <Box
                  sx={{
                    position: 'relative',
                    ml: 0.5,
                  }}
                >
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    size="small"
                    sx={{
                      padding: 0,
                    }}
                  >
                    {user?.profileImageUrl ? (
                      <Avatar
                        src={user.profileImageUrl}
                        alt={user.name}
                        sx={{ width: 32, height: 32 }}
                      />
                    ) : (
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: '#3AAA8F',
                          fontSize: '0.9rem'
                        }}
                      >
                        {getUserInitials()}
                      </Avatar>
                    )}
                  </IconButton>
                  {profileAnchorEl && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        borderRadius: '50%',
                        border: `2px solid #3AAA8F`,
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </Box>
              </Tooltip>
            </Box>
          ) : (
            /* 로그인되지 않은 상태 */
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}>
              <IconButton
                size="small"
                sx={{ mr: 1.5, padding: 0.5 }}
              >
                <SearchIcon sx={{ fontSize: '1.25rem' }} />
              </IconButton>

              <Button
                variant="contained"
                size="small"
                onClick={handleLogin}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  bgcolor: '#3AAA8F',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#2D8A73',
                  }
                }}
              >
                로그인
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 프로필 메뉴 렌더링 */}
      {renderProfileMenu}

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
              sx={{
                py: 1,
                px: 2,
                flexShrink: 0,
                flexGrow: 1,
                textAlign: 'center',
                borderRadius: 0,
                minWidth: { xs: '80px', sm: '100px' },
                fontSize: { xs: '0.8rem', sm: '0.875rem' },
                color: activeCategoryIndex === index ? '#3AAA8F' : 'text.primary',
                borderBottom: activeCategoryIndex === index ?
                  `2px solid #3AAA8F` : 'none',
                fontWeight: activeCategoryIndex === index ? 700 : 400,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#3AAA8F',
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