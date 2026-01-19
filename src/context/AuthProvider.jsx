import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import  authService  from "@/services/authService";

 const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    await authService.login(email, password);
    const currentUser = await authService.getCurrentUser();
    setUser(currentUser);
  };

  const register = async (email, password, name) => {
    await authService.register(email, password, name);
    
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
