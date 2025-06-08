import { createTheme } from '@mui/material/styles';

// 테마 색상 및 설정 커스터마이즈
const theme = createTheme({
    palette: {
        primary: {
            main: '#3AAA8F',
            light: '#D4F0E8',
            dark: '#2D8A73',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#FE8269',
            light: '#FFB4A1',
            dark: '#E6735A',
            contrastText: '#ffffff',
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
                root: ({ theme, ownerState }) => {
                    const { variant, color } = ownerState;

                    // 기본 스타일
                    const baseStyle = {
                        fontWeight: 500,
                        borderRadius: '8px',
                        textTransform: 'none' as const,
                        transition: 'all 0.2s ease-in-out',
                    };

                    // contained 버튼
                    if (variant === 'contained') {
                        if (color === 'primary') {
                            return {
                                ...baseStyle,
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.primary.contrastText,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.dark,
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(58, 170, 143, 0.3)',
                                },
                            };
                        }
                        if (color === 'secondary') {
                            return {
                                ...baseStyle,
                                backgroundColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.contrastText,
                                '&:hover': {
                                    backgroundColor: theme.palette.secondary.dark,
                                    transform: 'translateY(-1px)',
                                    boxShadow: '0 4px 8px rgba(254, 130, 105, 0.3)',
                                },
                            };
                        }
                        // 기본 contained 버튼 (color가 지정되지 않은 경우)
                        return {
                            ...baseStyle,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            '&:hover': {
                                backgroundColor: theme.palette.primary.dark,
                            },
                        };
                    }

                    // outlined 버튼
                    if (variant === 'outlined') {
                        if (color === 'primary') {
                            return {
                                ...baseStyle,
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    borderColor: theme.palette.primary.dark,
                                    backgroundColor: theme.palette.primary.light,
                                    color: theme.palette.primary.dark,
                                },
                            };
                        }
                        if (color === 'secondary') {
                            return {
                                ...baseStyle,
                                borderColor: theme.palette.secondary.main,
                                color: theme.palette.secondary.main,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    borderColor: theme.palette.secondary.dark,
                                    backgroundColor: 'rgba(254, 130, 105, 0.1)',
                                    color: theme.palette.secondary.dark,
                                },
                            };
                        }
                        // 기본 outlined 버튼
                        return {
                            ...baseStyle,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            backgroundColor: 'transparent',
                            '&:hover': {
                                borderColor: theme.palette.primary.dark,
                                backgroundColor: theme.palette.primary.light,
                            },
                        };
                    }

                    // text 버튼
                    if (variant === 'text') {
                        // 헤더 카테고리 버튼 (inherit 색상)
                        if (color === 'inherit') {
                            return {
                                ...baseStyle,
                                color: theme.palette.text.primary,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    color: theme.palette.primary.main,
                                },
                            };
                        }
                        if (color === 'primary') {
                            return {
                                ...baseStyle,
                                color: theme.palette.primary.main,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.light,
                                    color: theme.palette.primary.dark,
                                },
                            };
                        }
                        if (color === 'secondary') {
                            return {
                                ...baseStyle,
                                color: theme.palette.secondary.main,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: 'rgba(254, 130, 105, 0.1)',
                                    color: theme.palette.secondary.dark,
                                },
                            };
                        }
                        // 기본 text 버튼
                        return {
                            ...baseStyle,
                            color: theme.palette.text.primary,
                            backgroundColor: 'transparent',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                        };
                    }

                    // 기본값 (variant가 지정되지 않은 경우)
                    return {
                        ...baseStyle,
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                        },
                    };
                },
            },
        },
        // CardActionArea 스타일도 개선
        MuiCardActionArea: {
            styleOverrides: {
                root: ({ theme }) => ({
                    '&:hover': {
                        backgroundColor: 'rgba(58, 170, 143, 0.04)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out',
                    },
                    '& .MuiTypography-root': {
                        color: theme.palette.text.primary,
                    },
                }),
            },
        },
    },
});

export default theme;
