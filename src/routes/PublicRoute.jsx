import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

const PublicRoute = ({ children }) => {
  const auth = useAuth();

  // auth not ready yet
  if (!auth) return null;

  const { user, loading } = auth;

  // wait till auth check completes
  if (loading) return null;

  // if logged in → go dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
