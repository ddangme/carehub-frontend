import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Layout from '@/shared/components/Layout';
import HomePage from '@/pages/Home';
import NotFoundPage from '@/pages/NotFound';
import LoginPage from '@/pages/Login.tsx';
import Register from '@/shared/components/auth/Register.tsx';
import PrivateRoute from '@/shared/components/auth/PrivateRoute';

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<Layout />}>
        {/* 공개 라우트 */}
        <Route index element={<HomePage />} /> {/* 홈 페이지는 공개 접근 가능 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />

        {/* 보호된 라우트 */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<div>프로필 페이지</div>} />
          <Route path="/care-activities" element={<div>케어 활동 페이지</div>} />
          <Route path="/care-subjects" element={<div>케어 대상 페이지</div>} />
          <Route path="/schedules" element={<div>일정 관리 페이지</div>} />
          <Route path="/health-data" element={<div>건강 데이터 페이지</div>} />
        </Route>

        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </RouterRoutes>
  );
};