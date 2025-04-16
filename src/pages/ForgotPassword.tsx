import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { authApi } from '@/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('이메일을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await authApi.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || '비밀번호 재설정 이메일 발송에 실패했습니다.');
      console.error('Password reset request error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, mb: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom align="center">
            비밀번호 찾기
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {isSuccess ? (
            <Box>
              <Alert severity="success" sx={{ mb: 2 }}>
                비밀번호 재설정 링크가 이메일로 발송되었습니다. 이메일을 확인해주세요.
              </Alert>
              <Typography variant="body2" paragraph>
                이메일에 포함된 링크를 통해 새 비밀번호를 설정하실 수 있습니다.
                이메일이 보이지 않는 경우 스팸 폴더를 확인해주세요.
              </Typography>
              <Button
                component={RouterLink}
                to="/login"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                로그인 페이지로 돌아가기
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="body1" paragraph>
                가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
              </Typography>

              <TextField
                fullWidth
                label="이메일"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                autoFocus
              />

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
                  '비밀번호 재설정 링크 받기'
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

export default ForgotPassword;