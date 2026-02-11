import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    MapPin,
    Briefcase,
    Building,
    ArrowLeft,
    LogOut
} from "lucide-react";

const OfficialProfile = () => {
    const { profile, user } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
            {/* Top Navigation Bar */}
            <div className="bg-white shadow-md border-b border-yellow-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-yellow-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Official Dashboard</h1>
                                <p className="text-sm text-gray-600">
                                    {profile?.department?.replace(/_/g, " ") || "Unknown Department"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                to="/official/dashboard"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-yellow-600 transition"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="font-medium">Back to Dashboard</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto p-6">
                {/* Profile Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-8 text-white">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                                <User className="w-12 h-12 text-yellow-600" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{profile?.name || "Official"}</h1>
                                <p className="text-yellow-100 text-lg">{profile?.designation || "Government Official"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Mail className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">Email Address</p>
                                    <p className="text-gray-900 font-medium">{user?.email || "Not available"}</p>
                                </div>
                            </div>

                            {/* Department */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Building className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">Department</p>
                                    <p className="text-gray-900 font-medium">
                                        {profile?.department?.replace(/_/g, " ") || "Not assigned"}
                                    </p>
                                </div>
                            </div>

                            {/* Designation */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <Briefcase className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">Designation</p>
                                    <p className="text-gray-900 font-medium">{profile?.designation || "Not specified"}</p>
                                </div>
                            </div>

                            {/* District */}
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">District</p>
                                    <p className="text-gray-900 font-medium">{profile?.district || "Not specified"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Account Status */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                    ✓ Active Account
                                </div>
                                <div className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                                    Role: Official
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-4">
                    <Link
                        to="/official/work-orders"
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition">
                                <Briefcase className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Work Orders</h3>
                                <p className="text-sm text-gray-600">View and manage assignments</p>
                            </div>
                        </div>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition group text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-lg group-hover:bg-red-200 transition">
                                <LogOut className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Logout</h3>
                                <p className="text-sm text-gray-600">Sign out of your account</p>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OfficialProfile;
