import { createContext, useEffect, useState } from "react";
import { account, databases, Query } from "@/services/appwriteConfig";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const authUser = await account.get();
      setUser(authUser);

      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_USERS_COLLECTION_ID,
        [Query.equal("userId", authUser.$id)]
      );

      if (res.documents.length === 0) {
        navigate("/register");
      } else {
        setProfile(res.documents[0]);
      }
    } catch (err) {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
    setProfile(null);
    // Don't navigate here - let the component handle navigation
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, userProfile: profile, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
