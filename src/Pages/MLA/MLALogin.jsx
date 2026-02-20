import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { account, databases } from "@/services/appwriteConfig";
import { Building2, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { Query } from "appwrite";

const MLALogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            await account.createEmailPasswordSession(email, password);
            const user = await account.get();

            const userProfile = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_USERS_COLLECTION_ID,
                [Query.equal("userId", user.$id)]
            );

            if (userProfile.documents.length === 0) {
                setError("User profile not found");
                await account.deleteSession("current");
                return;
            }

            const profile = userProfile.documents[0];

            if (profile.role !== "mla" && profile.role !== "official") {
                setError("Access denied. This portal is for Government Officials only. Your application may still be pending approval.");
                await account.deleteSession("current");
                return;
            }

            if (profile.role === "official") {
                window.location.href = "/official/dashboard";
            } else {
                window.location.href = "/mla/dashboard";
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || "Invalid credentials");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side — Background Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1575517111478-7f6afd0973db?auto=format&fit=crop&w=1200&q=80"
                    alt="Government Building"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-red-900/70 to-amber-900/60"></div>
                <div className="relative z-10 flex flex-col justify-end p-12 text-white">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <Building2 className="w-6 h-6 text-amber-400" />
                        <span className="text-amber-300 font-medium text-sm uppercase tracking-wider">Government Access</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-3">Government Official Portal</h2>
                    <p className="text-lg text-red-100 max-w-md">
                        Serve your constituency better. Access reports, manage work orders, and respond to citizen concerns.
                    </p>
                    <div className="flex gap-6 mt-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold">MLA</p>
                            <p className="text-sm text-red-200">Access</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">Dept</p>
                            <p className="text-sm text-red-200">Officials</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">24/7</p>
                            <p className="text-sm text-red-200">Dashboard</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side — Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-red-50 via-white to-orange-50">
                <div className="relative w-full max-w-md">
                    {/* Back Link */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
                        <span className="font-medium">Back to Home</span>
                    </Link>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4">
                                <Building2 className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Official Portal</h1>
                            <p className="text-gray-600">Access your official dashboard</p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Official Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="mla@example.com"
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    "Access Portal"
                                )}
                            </button>
                        </form>

                        {/* Application Link */}
                        <div className="mt-6 text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have official access?{" "}
                                <Link to="/register" className="text-red-600 hover:text-red-700 font-semibold">
                                    Apply Now
                                </Link>
                            </p>
                        </div>

                        {/* Info Notice */}
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-xs text-red-800">
                                <strong>Note:</strong> This portal is only accessible to approved MLAs and Department Officials.
                                If you've applied, please wait for admin approval.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MLALogin;
