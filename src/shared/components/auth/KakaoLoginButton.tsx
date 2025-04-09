import React from 'react';
import { Button, SxProps } from '@mui/material';
import kakaoApi from '@/api/kakaoApi';

interface KakaoLoginButtonProps {
  disabled?: boolean;
  sx?: SxProps;
}

/**
 * 카카오 로그인 버튼 컴포넌트
 */
const KakaoLoginButton: React.FC<KakaoLoginButtonProps> = ({ disabled, sx }) => {
  const handleKakaoLogin = () => {
    const kakaoAuthUrl = kakaoApi.getKakaoLoginUrl();
    window.location.href = kakaoAuthUrl;
  };

  return (
    <Button
      fullWidth
      variant="contained"
      onClick={handleKakaoLogin}
      disabled={disabled}
      sx={{
        py: { xs: 1, sm: 1.5 },
        backgroundColor: '#FEE500',
        color: '#000000',
        borderColor: '#FEE500',
        '&:hover': {
          backgroundColor: '#F6DC00',
          borderColor: '#F6DC00',
        },
        '& .kakaoIcon': {
          marginRight: 1,
          width: 18,
          height: 18,
        },
        ...sx
      }}
      startIcon={
        <img
          src="/kakao_icon.png"
          alt="Kakao"
          className="kakaoIcon"
        />
      }
    >
      카카오 로그인
    </Button>
  );
};

export default KakaoLoginButton;