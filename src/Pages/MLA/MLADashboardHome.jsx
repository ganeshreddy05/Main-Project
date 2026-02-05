import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { databases } from "@/services/appwriteConfig";
import { Query } from "appwrite";
import { AuthContext } from "@/context/AuthProvider";
import {
    MapPin,
    FileText,
    Users,
    AlertCircle,
    TrendingUp,
    Building2,
    CheckCircle,
    Clock
} from "lucide-react";

const MLADashboardHome = () => {
    const { profile } = useContext(AuthContext);

    // Fetch road reports from MLA's district
    const { data: roadReports = [], isLoading: loadingReports } = useQuery({
        queryKey: ["mla-road-reports", profile?.district],
        queryFn: async () => {
            if (!profile?.district) return [];
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
                [Query.equal("district", profile.district), Query.orderDesc("$createdAt")]
            );
            return res.documents;
        },
        enabled: !!profile?.district,
    });

    // Fetch help requests from MLA's district
    const { data: helpRequests = [], isLoading: loadingRequests } = useQuery({
        queryKey: ["mla-help-requests", profile?.district],
        queryFn: async () => {
            if (!profile?.district) return [];
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
                [Query.equal("district", profile.district), Query.orderDesc("$createdAt")]
            );
            return res.documents;
        },
        enabled: !!profile?.district,
    });

    const stats = [
        {
            label: "Total Road Reports",
            value: roadReports.length,
            icon: FileText,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            label: "Help Requests",
            value: helpRequests.length,
            icon: Users,
            color: "bg-purple-500",
            bgColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            label: "Pending Issues",
            value:
                roadReports.filter((r) => r.status === "pending").length +
                helpRequests.filter((h) => h.status === "pending").length,
            icon: Clock,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-600",
        },
        {
            label: "Resolved Issues",
            value:
                roadReports.filter((r) => r.status === "resolved").length +
                helpRequests.filter((h) => h.status === "resolved").length,
            icon: CheckCircle,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
    ];

    const recentReports = roadReports.slice(0, 5);

    if (loadingReports || loadingRequests) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {profile?.name}!</h1>
                <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Representing <span className="font-semibold">{profile?.district}, {profile?.state}</span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition">
                            <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                                <Icon className={`w-6 h-6 ${stat.textColor}`} />
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Constituency Info */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5" />
                            <h2 className="text-xl font-bold">Your Constituency</h2>
                        </div>
                        <p className="text-purple-100 mb-4">
                            You are serving the people of {profile?.district} constituency in {profile?.state}
                        </p>
                        <div className="flex gap-4">
                            <div>
                                <div className="text-2xl font-bold">{roadReports.length + helpRequests.length}</div>
                                <div className="text-sm text-purple-100">Total Issues Reported</div>
                            </div>
                            <div className="w-px bg-purple-300"></div>
                            <div>
                                <div className="text-2xl font-bold">
                                    {roadReports.filter((r) => r.status === "resolved").length +
                                        helpRequests.filter((h) => h.status === "resolved").length}
                                </div>
                                <div className="text-sm text-purple-100">Issues Resolved</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                </div>
            </div>

            {/* Recent Road Reports */}
            <div className="bg-white rounded-xl border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Recent Road Reports from Your District</h2>
                    <p className="text-sm text-gray-600 mt-1">Latest issues reported in {profile?.district}</p>
                </div>
                {recentReports.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No road reports yet from your constituency</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {recentReports.map((report) => (
                            <div key={report.$id} className="p-4 hover:bg-gray-50 transition">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-1">{report.description}</p>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {report.location || report.district}
                                            </span>
                                            <span>•</span>
                                            <span>{new Date(report.$createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${report.status === "resolved"
                                                    ? "bg-green-100 text-green-700"
                                                    : report.status === "in-progress"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {report.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left">
                        <FileText className="w-6 h-6 text-purple-600 mb-2" />
                        <div className="font-semibold text-gray-900">View All Reports</div>
                        <div className="text-sm text-gray-600">See all road reports in your area</div>
                    </button>
                    <button className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left">
                        <Users className="w-6 h-6 text-purple-600 mb-2" />
                        <div className="font-semibold text-gray-900">Help Requests</div>
                        <div className="text-sm text-gray-600">Manage citizen help requests</div>
                    </button>
                    <button className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left">
                        <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
                        <div className="font-semibold text-gray-900">Analytics</div>
                        <div className="text-sm text-gray-600">View constituency insights</div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MLADashboardHome;
