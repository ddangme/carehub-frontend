import { combineReducers } from '@reduxjs/toolkit';
// 도메인별 리듀서를 여기에 import
// import authReducer from '@/domains/auth/authSlice';

const rootReducer = combineReducers({
    // 도메인별 리듀서 추가
    // auth: authReducer,
});

export default rootReducer;