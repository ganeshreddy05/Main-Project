import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthProvider";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, profile, loading } = useContext(AuthContext);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
            </div>
        );
    }

    // Not logged in - redirect to login
    if (!user || !profile) {
        return <Navigate to="/login" replace />;
    }

    // Check if user's role is allowed
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        // Wrong role - redirect to appropriate dashboard
        if (profile.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        } else if (profile.role === "mla") {
            return <Navigate to="/mla/dashboard" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // All checks passed - render the protected content
    return children;
};

export default ProtectedRoute;
