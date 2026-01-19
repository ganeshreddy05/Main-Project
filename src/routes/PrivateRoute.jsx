import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";

const PublicRoute = ({ children }) => {
  const auth = useAuth();

  if (!auth) return null;

  const { user, loading } = auth;

  if (loading) return null;

 
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
