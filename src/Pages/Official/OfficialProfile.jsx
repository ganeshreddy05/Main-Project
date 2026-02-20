import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import {
    User,
    Mail,
    MapPin,
    Briefcase,
    Building
} from "lucide-react";

const OfficialProfile = () => {
    const { profile, user } = useContext(AuthContext);

    return (
        <div>
            {/* Profile Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-amber-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold mb-1">{profile?.name || "Official"}</h1>
                            <p className="text-amber-100 text-lg">{profile?.designation || "Government Official"}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Profile Information</h2>

                    <div className="grid md:grid-cols-2 gap-5">
                        {/* Email */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <Mail className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-1">Email Address</p>
                                <p className="text-gray-900 font-medium">{user?.email || "Not available"}</p>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <Building className="w-5 h-5 text-amber-600" />
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
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <Briefcase className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-1">Designation</p>
                                <p className="text-gray-900 font-medium">{profile?.designation || "Not specified"}</p>
                            </div>
                        </div>

                        {/* District */}
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-amber-50 rounded-lg">
                                <MapPin className="w-5 h-5 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 mb-1">District</p>
                                <p className="text-gray-900 font-medium">{profile?.district || "Not specified"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Account Status */}
                    <div className="mt-6 pt-5 border-t border-gray-200">
                        <h3 className="text-md font-semibold text-gray-900 mb-3">Account Status</h3>
                        <div className="flex items-center gap-3">
                            <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                ✓ Active Account
                            </div>
                            <div className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                                Role: Official
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficialProfile;
