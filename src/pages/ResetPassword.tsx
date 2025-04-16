import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { authApi } from '@/api';

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);

  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // 토큰 유효성 검증
  useEffect(() => {
    const verifyToken = async () => {
      if (!token || !email) {
        setError('유효하지 않은 링크입니다. 비밀번호 재설정을 다시 요청해주세요.');
        setIsVerifying(false);
        return;
      }

      try {
        const response = await authApi.verifyPasswordResetToken(email, token);
        setIsTokenValid(response.verified);
        setIsVerifying(false);

        if (!response.verified) {
          setError('만료되거나 유효하지 않은 링크입니다. 비밀번호 재설정을 다시 요청해주세요.');
        }
      } catch (err: any) {
        setError(err.message || '토큰 검증에 실패했습니다.');
        setIsVerifying(false);
        console.error('Token verification error:', err);
      }
    };

    verifyToken();
  }, [token, email]);

  // 비밀번호 유효성 검증
  const validatePassword = () => {
    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return false;
    }

    if (!/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
      setError('비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword() || !email || !token) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await authApi.resetPassword(email, token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || '비밀번호 재설정에 실패했습니다.');
      console.error('Password reset error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩 화면
  if (isVerifying) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 5, mb: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ mt: 2 }}>
            링크 확인 중...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            비밀번호 재설정
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!isTokenValid && !isSuccess ? (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                component={RouterLink}
                to="/forgot-password"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                비밀번호 재설정 다시 요청하기
              </Button>
            </Box>
          ) : isSuccess ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                비밀번호가 성공적으로 재설정되었습니다.
              </Alert>
              <Typography variant="body2" paragraph>
                새 비밀번호로 로그인하실 수 있습니다.
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                로그인 페이지로 이동
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="body1" paragraph>
                새로운 비밀번호를 입력해주세요.
              </Typography>

              <TextField
                fullWidth
                label="새 비밀번호"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                required
                autoFocus
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="새 비밀번호 확인"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                비밀번호는 8자 이상이며, 영문, 숫자, 특수문자를 포함해야 합니다.
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  '비밀번호 재설정'
                )}
              </Button>

              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  로그인으로 돌아가기
                </Link>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPassword;