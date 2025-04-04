import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api';
import EmailVerification from './EmailVerification';

const steps = ['이메일 인증', '정보 입력', '가입 완료'];

interface UserInfo {
  email: string;
  verificationToken: string;
  name: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const Register: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    verificationToken: '',
    name: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const navigate = useNavigate();

  // 이메일 인증 완료 시 호출되는 함수
  const handleEmailVerified = (email: string, token: string) => {
    setUserInfo(prev => ({
      ...prev,
      email,
      verificationToken: token
    }));

    setActiveStep(1); // 다음 단계로 이동
  };

  // 사용자 정보 유효성 검사
  const validateUserInfo = () => {
    const newErrors: Record<string, string> = {};

    if (!userInfo.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!userInfo.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (userInfo.password.length < 8) {
      newErrors.password = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(userInfo.password)) {
      newErrors.password = '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.';
    }

    if (userInfo.password !== userInfo.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    if (!validateUserInfo()) return;

    setIsLoading(true);
    setApiError(null);

    try {
      await authApi.register({
        email: userInfo.email,
        password: userInfo.password,
        name: userInfo.name,
        phone: userInfo.phone,
        verificationToken: userInfo.verificationToken
      });

      setActiveStep(2); // 가입 완료 단계로 이동
    } catch (err: any) {
      setApiError(err.message || '회원가입 중 오류가 발생했습니다.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 페이지로 이동
  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, mb: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          회원가입
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <EmailVerification
            onVerified={handleEmailVerified}
            onBack={() => navigate('/login')}
          />
        )}

        {activeStep === 1 && (
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6" gutterBottom>
              회원 정보 입력
            </Typography>

            {apiError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {apiError}
              </Alert>
            )}

            <Box component="form" noValidate>
              <TextField
                fullWidth
                label="이름"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                margin="normal"
                error={!!errors.name}
                helperText={errors.name}
                required
              />

              <TextField
                fullWidth
                label="비밀번호"
                type="password"
                value={userInfo.password}
                onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                margin="normal"
                error={!!errors.password}
                helperText={errors.password}
                required
              />

              <TextField
                fullWidth
                label="비밀번호 확인"
                type="password"
                value={userInfo.confirmPassword}
                onChange={(e) => setUserInfo({ ...userInfo, confirmPassword: e.target.value })}
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                required
              />

              <TextField
                fullWidth
                label="전화번호"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                margin="normal"
                placeholder="예: 01012345678"
                required
              />

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    '가입하기'
                  )}
                </Button>
              </Box>
            </Box>
          </Paper>
        )}

        {activeStep === 2 && (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="primary">
              회원가입이 완료되었습니다!
            </Typography>

            <Typography variant="body1" paragraph>
              {userInfo.email}로 가입이 완료되었습니다.
            </Typography>

            <Typography variant="body2" paragraph>
              이제 로그인하여 서비스를 이용하실 수 있습니다.
            </Typography>

            <Button
              variant="contained"
              onClick={goToLogin}
              fullWidth
              sx={{ mt: 3 }}
            >
              로그인하기
            </Button>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default Register;