import { useState } from "react";
import { account, databases, ID } from "@/services/appwriteConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");

  const registerHandler = async () => {
    try {
      // ✅ Create Auth user
      const authUser = await account.create(
        ID.unique(),
        email,
        password,
        name
      );

      // ✅ Create DB profile (NO login here)
      await databases.createDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: authUser.$id,
          name,
          email,
          phone,
          city,
        }
      );

      alert("Registration successful. Please login.");
      navigate("/login"); // 👈 go to login instead of dashboard
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Create Account</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Phone"
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="City"
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={registerHandler}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        Register
      </button>
    </div>
  );
};

export default Register;
