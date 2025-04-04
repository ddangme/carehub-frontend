import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Layout from '@/shared/components/Layout';
import HomePage from '@/pages/Home';
import NotFoundPage from '@/pages/NotFound';
import LoginPage from '@/pages/Login.tsx';
import Register from '../shared/components/auth/Register.tsx';

export const Routes = () => {
    return (
        <RouterRoutes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </RouterRoutes>
    );
};