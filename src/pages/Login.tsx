import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Divider,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/shared/contexts/AuthContext';

// Custom Kakao button icon component
const KakaoIcon = () => (
  <img
    src="/kakao_icon.png"
    alt="카카오 로그인"
    style={{ width: 18, height: 18 }}
  />
);

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // AuthContext의 login 함수 호출
      await login(email, password);
      // 로그인 성공 시 홈으로 리다이렉트 (AuthContext 내부에서 처리)
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = () => {
    // Handle Kakao OAuth login
    console.log('Kakao login clicked');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 }
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mt: { xs: 2, sm: 4, md: 6 },
          mb: { xs: 2, sm: 3, md: 4 },
          borderRadius: { xs: 1, sm: 2 }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            fontWeight="600"
            color="primary"
            sx={{
              mb: { xs: 2, sm: 3 },
              fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
            }}
          >
            로그인
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                mb: { xs: 1.5, sm: 2 },
                fontSize: { xs: '0.8rem', sm: '0.875rem' }
              }}
            >
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%' }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={handleEmailChange}
              size={isMobile ? "small" : "medium"}
              sx={{
                mb: { xs: 0, sm: 0 },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              size={isMobile ? "small" : "medium"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size={isMobile ? "small" : "medium"}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize={isMobile ? "small" : "medium"} /> : <VisibilityIcon fontSize={isMobile ? "small" : "medium"} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: { xs: 1, sm: 1 },
                '& .MuiInputLabel-root': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                },
                '& .MuiInputBase-input': {
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }
              }}
            />

            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mb: { xs: 1.5, sm: 2 },
              mt: { xs: 0.5, sm: 0.5 }
            }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                color="secondary"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  fontWeight: 500
                }}
              >
                비밀번호 찾기
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size={isMobile ? "medium" : "large"}
              disabled={isLoading}
              sx={{
                mt: { xs: 1, sm: 1 },
                mb: { xs: 1, sm: 0.5 },
                py: { xs: 1, sm: 1 },
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                '로그인'
              )}
            </Button>

            <Divider sx={{
              my: { xs: 1.5, sm: 1.5 }
            }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' }
                }}
              >
                또는
              </Typography>
            </Divider>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              mb: { xs: 2, sm: 3 }
            }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<KakaoIcon />}
                onClick={handleKakaoLogin}
                size={isMobile ? "medium" : "large"}
                sx={{
                  py: { xs: 1, sm: 1.5 },
                  backgroundColor: '#FEE500',
                  color: '#000',
                  borderColor: '#FEE500',
                  '&:hover': {
                    backgroundColor: '#F6DC00',
                    borderColor: '#F6DC00',
                  },
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                카카오 계정으로 로그인
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }
                }}
              >
                아직 계정이 없으신가요?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  color="secondary"
                  fontWeight="600"
                  sx={{
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  회원가입
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;