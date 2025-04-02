import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '50vh'
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom>
                404 - 페이지를 찾을 수 없습니다
            </Typography>
            <Typography variant="body1" paragraph>
                요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
            >
                홈으로 돌아가기
            </Button>
        </Box>
    );
};

export default NotFoundPage;