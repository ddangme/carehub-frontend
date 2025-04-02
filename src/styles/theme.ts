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
    },
});

export default theme;