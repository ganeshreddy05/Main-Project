import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import { User, Mail, Phone, MapPin, Building2, Shield, Calendar } from "lucide-react";

const MLAProfile = () => {
    const { user, profile } = useContext(AuthContext);

    if (!profile) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
                <p className="text-gray-600 mt-1">View your account information</p>
            </div>

            {/* Main Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                {/* Header Section */}
                <div className="bg-blue-600 px-6 py-8 rounded-t-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                            <span className="text-3xl font-semibold text-blue-600">
                                {profile?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="text-white">
                            <h2 className="text-2xl font-semibold">{profile?.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield className="w-4 h-4" />
                                <span className="text-blue-100">MLA - {profile?.district}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                    <div className="space-y-4">
                        {/* Name */}
                        <div className="flex items-start border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3 w-48">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Full Name</span>
                            </div>
                            <span className="text-sm text-gray-900">{profile?.name}</span>
                        </div>

                        {/* Email */}
                        <div className="flex items-start border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3 w-48">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Email</span>
                            </div>
                            <span className="text-sm text-gray-900">{profile?.email || user?.email}</span>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3 w-48">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Phone</span>
                            </div>
                            <span className="text-sm text-gray-900">{profile?.phone || "Not provided"}</span>
                        </div>

                        {/* State */}
                        <div className="flex items-start border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3 w-48">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">State</span>
                            </div>
                            <span className="text-sm text-gray-900">{profile?.state}</span>
                        </div>

                        {/* Constituency */}
                        <div className="flex items-start border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3 w-48">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Constituency</span>
                            </div>
                            <span className="text-sm text-gray-900">{profile?.district}</span>
                        </div>

                        {/* Party */}
                        {profile?.partyName && (
                            <div className="flex items-start border-b border-gray-100 pb-3">
                                <div className="flex items-center gap-3 w-48">
                                    <Shield className="w-4 h-4 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-600">Political Party</span>
                                </div>
                                <span className="text-sm text-gray-900">{profile.partyName}</span>
                            </div>
                        )}

                        {/* Account Created */}
                        <div className="flex items-start border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-3 w-48">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Member Since</span>
                            </div>
                            <span className="text-sm text-gray-900">
                                {user?.$createdAt ? new Date(user.$createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                }) : "N/A"}
                            </span>
                        </div>

                        {/* Role */}
                        <div className="flex items-start pb-3">
                            <div className="flex items-center gap-3 w-48">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-600">Role</span>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {profile?.role?.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Account Status */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-lg">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">Account Status: Active</p>
                            <p className="text-sm text-gray-600 mt-1">
                                Your account has been verified and you have access to all MLA features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Note */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                    <strong>Note:</strong> To update your profile information, please contact the system administrator.
                </p>
            </div>
        </div>
    );
};

export default MLAProfile;
