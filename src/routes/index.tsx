import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Layout from '@/shared/components/Layout';
import HomePage from '@/pages/Home';
import NotFoundPage from '@/pages/NotFound';
import LoginPage from '@/pages/Login';
import Register from '@/shared/components/auth/Register';
import PrivateRoute from '@/shared/components/auth/PrivateRoute';
import KakaoCallback from '@/pages/KakaoCallBack';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import ProfileList from '@/pages/ProfileList';
import ProfileDetail from '@/pages/ProfileDetail';
import ProfileCreation from '@/shared/components/profile/ProfileCreation';
import CareRecordList from '@/pages/CareRecordList';
import CareRecordDetail from '@/pages/CareRecordDetail';
import CareRecordCreate from '@/pages/CareRecordCreate';

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Layout />}>
        {/* 공개 라우트 */}
        <Route index element={<HomePage />} /> {/* 홈 페이지는 공개 접근 가능 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/kakao/callback" element={<KakaoCallback />} />

        {/* 보호된 라우트 */}
        <Route element={<PrivateRoute />}>
          {/* 프로필 관련 라우트 */}
          <Route path="/care-subjects" element={<ProfileList />} />
          <Route path="/care-subjects/create" element={<ProfileCreation />} />
          <Route path="/care-subjects/:id" element={<ProfileDetail />} />
          <Route path="/care-subjects/infant/:id" element={<ProfileDetail />} />
          <Route path="/care-subjects/:id/edit" element={<ProfileCreation />} />
          <Route path="/care-subjects/infant/:id/edit" element={<ProfileCreation />} />

          {/* 케어 기록 관련 라우트 */}
          <Route path="/care-records" element={<CareRecordList />} />
          <Route path="/care-records/create" element={<CareRecordCreate />} />
          <Route path="/care-records/:id" element={<CareRecordDetail />} />
          <Route path="/care-records/:id/edit" element={<CareRecordCreate />} />

          {/* 기타 보호된 라우트들 */}
          <Route path="/profile" element={<div>프로필 페이지</div>} />
          <Route path="/schedules" element={<div>일정 관리 페이지</div>} />
          <Route path="/health-data" element={<div>건강 데이터 페이지</div>} />
        </Route>

        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </RouterRoutes>
  );
};
