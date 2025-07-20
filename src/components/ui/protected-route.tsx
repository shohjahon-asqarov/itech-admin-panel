import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from './loading';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'user';
    fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    fallbackPath = '/login',
}) => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <LoadingSpinner size="xl" text="Autentifikatsiya tekshirilmoqda..." />
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return (
            <Navigate
                to={fallbackPath}
                state={{ from: location }}
                replace
            />
        );
    }

    // Check role if required
    if (requiredRole && user?.role !== requiredRole) {
        return (
            <Navigate
                to="/unauthorized"
                state={{ from: location }}
                replace
            />
        );
    }

    return <>{children}</>;
};

// Route guard hook
export const useRouteGuard = () => {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    const canAccess = (requiredRole?: 'admin' | 'user'): boolean => {
        if (loading) return false;
        if (!isAuthenticated) return false;
        if (requiredRole && user?.role !== requiredRole) return false;
        return true;
    };

    const getRedirectPath = (): string => {
        if (!isAuthenticated) return '/login';
        if (user?.role !== 'admin') return '/unauthorized';
        return '/';
    };

    return {
        canAccess,
        getRedirectPath,
        isAuthenticated,
        user,
        loading,
        currentPath: location.pathname,
    };
};

// Admin only route
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized">
            {children}
        </ProtectedRoute>
    );
};

// User route (any authenticated user)
export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <ProtectedRoute requiredRole="user" fallbackPath="/login">
            {children}
        </ProtectedRoute>
    );
};

// Public route (redirect if already authenticated)
export const PublicRoute: React.FC<{
    children: React.ReactNode;
    redirectPath?: string;
}> = ({ children, redirectPath = '/dashboard' }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <LoadingSpinner size="xl" text="Yuklanmoqda..." />
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

// Unauthorized page component
export const UnauthorizedPage: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Ruxsat yo'q
                </h1>
                <p className="text-gray-600 mb-6">
                    Sizda bu sahifaga kirish uchun yetarli huquqlar yo'q. Iltimos, administrator bilan bog'laning.
                </p>
                {user && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600">
                            <strong>Joriy foydalanuvchi:</strong> {user.name}
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Roli:</strong> {user.role}
                        </p>
                    </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        onClick={() => window.history.back()}
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Orqaga qaytish
                    </button>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Bosh sahifa
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProtectedRoute; 