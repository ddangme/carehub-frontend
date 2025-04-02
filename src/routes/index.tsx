import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Layout from '@/shared/components/Layout';
import HomePage from '@/pages/Home';
import NotFoundPage from '@/pages/NotFound';
import LoginPage from '@/pages/Login.tsx';

export const Routes = () => {
    return (
        <RouterRoutes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="*" element={<LoginPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </RouterRoutes>
    );
};