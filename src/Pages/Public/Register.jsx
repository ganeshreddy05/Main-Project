import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { databases, ID } from "@/services/appwriteConfig";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const submitHandler = async () => {
    try {
      // 1️⃣ Create auth account
      const user = await authService.register(email, password, name);

      // 2️⃣ Create user profile
      await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          name,
          email,
          phone,
        }
      );

      alert("Registered successfully ✅");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Create Account
      </h2>

      <Input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <Input
        className="mt-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        className="mt-3"
        placeholder="Phone Number"
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input
        className="mt-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button className="mt-5 w-full" onClick={submitHandler}>
        Register
      </Button>
    </div>
  );
};

export default Register;
