import { createTheme } from '@mui/material/styles';

// 테마 색상 및 설정 커스터마이즈
const theme = createTheme({
    palette: {
        primary: {
            main: '#3AAA8F',
        },
        secondary: {
            main: '#FE8269', // 케어 허브의 서브 색상(Grass 색상)
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
    },
    // 컨테이너 최대 너비 커스터마이징
    components: {
        MuiContainer: {
            styleOverrides: {
                root: {
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    boxSizing: 'border-box',
                    width: '100%',
                    '@media (min-width:600px)': {
                        paddingLeft: '32px',
                        paddingRight: '32px',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: 'white', // 모든 버튼의 기본 텍스트 색상을 화이트로 설정
                },
                // 특정 버튼 variant에 대한 추가 설정 가능
                contained: {
                    color: 'white',
                },
                outlined: {
                    color: 'white',
                },
            },
        },
    },
});

export default theme;