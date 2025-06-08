import { combineReducers } from '@reduxjs/toolkit';

// 임시 더미 리듀서 추가
const dummyReducer = (state = {}, _action: any) => {
  return state;
};

const rootReducer = combineReducers({
  // 도메인별 리듀서 추가 예정
  // auth: authReducer,
  dummy: dummyReducer, // 임시 더미 리듀서
});

export default rootReducer;