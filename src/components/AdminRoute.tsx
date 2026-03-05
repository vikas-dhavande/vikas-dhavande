import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * AdminRoute — protects all /admin/* routes.
 *
 * Behaviour:
 *   - Loading  → spinner
 *   - Not logged in → /login (with redirect-back state)
 *   - Logged in but NOT admin → / (silent redirect)
 *   - Logged in AND admin → renders children via <Outlet />
 */
export function AdminRoute() {
    const { isLoggedIn, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        // User is logged in but does not have the 'admin' label
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
