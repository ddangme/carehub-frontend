import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
    return (
        <Box component="footer" sx={{ py: 3, mt: 'auto' }}>
            <Container maxWidth="lg">
                <Typography variant="body2" align="center">
                    © {new Date().getFullYear()} Care Hub - 종합 케어 관리 플랫폼
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                    <Link color="inherit" href="#" sx={{ mx: 1 }}>
                        이용약관
                    </Link>
                    |
                    <Link color="inherit" href="#" sx={{ mx: 1 }}>
                        개인정보처리방침
                    </Link>
                    |
                    <Link color="inherit" href="#" sx={{ mx: 1 }}>
                        고객센터
                    </Link>
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;