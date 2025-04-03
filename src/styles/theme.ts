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
                root: ({ ownerState }) => ({
                    // 기본 버튼은 흰색 텍스트
                    color: 'white',
                    // variant가 text이고 color가 inherit인 경우(헤더 카테고리 버튼)는 검정색 텍스트
                    ...(ownerState.variant === 'text' && ownerState.color === 'inherit' && {
                        color: 'black',
                    }),
                }),
            },
        },
    },
});

export default theme;