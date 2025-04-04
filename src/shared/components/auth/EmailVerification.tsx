import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { authApi } from '@/api';

interface EmailVerificationProps {
  onVerified: (email: string, token: string) => void;
  onBack?: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerified }) => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  // 이메일 유효성 검사
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
    // 이메일이 변경되면 코드 전송 상태와 에러 초기화
    if (codeSent) {
      setCodeSent(false);
      setTimer(0);
    }
    setError(null);
  }, [email]);

  // 타이머 기능
  useEffect(() => {
    let interval: number | undefined;

    if (timer > 0) {
      interval = window.setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 && codeSent) {
      // 타이머가 0이 되면 재전송 가능
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer, codeSent]);

  // 인증코드 발송 및 이메일 중복 체크를 한번에 처리
  const sendVerificationCode = async () => {
    if (!isEmailValid) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. 먼저 이메일 중복 체크
      const isAvailable = await authApi.checkEmailAvailability(email);

      if (!isAvailable) {
        setError('이미 사용 중인 이메일입니다.');
        setIsLoading(false);
        return;
      }

      // 2. 이메일이 사용 가능하면 인증코드 발송
      await authApi.sendVerificationCode(email);
      setCodeSent(true);
      setTimer(300); // 5분 타이머 시작
    } catch (err: any) {
      setError(err.message || '인증코드 발송 중 오류가 발생했습니다.');
      console.error('Email verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 확인
  const verifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('유효한 인증코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyEmailCode(email, verificationCode);

      if (response.verified && response.verificationToken) {
        onVerified(email, response.verificationToken);
      } else {
        setError('인증에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      setError(err.message || '인증 중 오류가 발생했습니다.');
      console.error('Verify code error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 인증코드 재전송
  const resendVerificationCode = async () => {
    if (timer > 0) return;

    setIsLoading(true);
    setError(null);

    try {
      await authApi.sendVerificationCode(email);
      setTimer(300); // 5분 타이머 재설정
    } catch (err: any) {
      setError(err.message || '인증코드 재전송 중 오류가 발생했습니다.');
      console.error('Resend verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        이메일 인증
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" noValidate>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={codeSent}
            error={!!error && error.includes('이메일')}
            margin="normal"
            required
          />

          {!codeSent ? (
            <Button
              variant="contained"
              onClick={sendVerificationCode}
              disabled={!isEmailValid || isLoading}
              sx={{ mt: 2 }}
              fullWidth
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                '인증코드 전송'
              )}
            </Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                {email}
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => setCodeSent(false)}
                sx={{ ml: 1 }}
              >
                변경
              </Button>
            </Box>
          )}
        </Box>

        {codeSent && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                이메일로 전송된 6자리 인증 코드를 입력해주세요.
              </Typography>
              <Typography variant="body2" color={timer < 60 ? "error.main" : "text.secondary"}>
                {formatTime(timer)}
              </Typography>
            </Box>

            <TextField
              fullWidth
              label="인증코드"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
              margin="normal"
              inputProps={{ maxLength: 6 }}
              required
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="outlined"
                onClick={resendVerificationCode}
                disabled={timer > 0 || isLoading}
                sx={{ flex: 1 }}
              >
                재전송
              </Button>

              <Button
                variant="contained"
                onClick={verifyCode}
                disabled={verificationCode.length !== 6 || isLoading}
                sx={{ flex: 1 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  '인증하기'
                )}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default EmailVerification;