import { useState } from "react";
import { account, databases, Query } from "@/services/appwriteConfig";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      await account.createEmailPasswordSession(email, password);

      const authUser = await account.get();

      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_USERS_COLLECTION_ID,
        [Query.equal("userId", authUser.$id)]
      );

      if (res.documents.length === 0) {
        window.location.href = "/register";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={loginHandler}
        className="w-full bg-indigo-600 text-white p-2 rounded"
      >
        Login
      </button>
    </div>
  );
};

export default Login;
