import React from 'react';
import { Typography, Box } from '@mui/material';

const HomePage: React.FC = () => {
    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
                Care Hub
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom>
                종합 케어 관리 플랫폼
            </Typography>
            <Typography variant="body1" paragraph>
                실시간 정보 공유와 체계적인 케어 기록 관리를 통해
                보호자들 간의 소통을 원활히 하고 돌봄의 질을 향상시키는 플랫폼입니다.
            </Typography>
        </Box>
    );
};

export default HomePage;