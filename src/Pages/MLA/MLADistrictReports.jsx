import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { databases } from "@/services/appwriteConfig";
import { Query } from "appwrite";
import { AuthContext } from "@/context/AuthProvider";
import { MapIcon, Users, ArrowRight, FileText, AlertCircle } from "lucide-react";

const MLADistrictReports = () => {
    const { profile } = useContext(AuthContext);
    const navigate = useNavigate();

    // Fetch road reports count
    const { data: roadReports = [] } = useQuery({
        queryKey: ["mla-road-reports", profile?.district],
        queryFn: async () => {
            if (!profile?.district) return [];

            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );

            return res.documents.filter(
                doc => doc.district?.toLowerCase() === profile.district?.toLowerCase()
            );
        },
        enabled: !!profile?.district,
    });

    // Fetch help requests count
    const { data: helpRequests = [] } = useQuery({
        queryKey: ["mla-help-requests", profile?.district],
        queryFn: async () => {
            if (!profile?.district) return [];

            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );

            return res.documents.filter(
                doc => doc.district?.toLowerCase() === profile.district?.toLowerCase()
            );
        },
        enabled: !!profile?.district,
    });

    const reportsData = [
        {
            title: "Road Reports",
            description: "View all road condition reports from your constituency",
            icon: MapIcon,
            count: roadReports.length,
            pendingCount: roadReports.filter(r => r.status?.toUpperCase() === "ACTIVE" || r.status?.toUpperCase() === "PENDING").length,
            resolvedCount: roadReports.filter(r => r.status?.toUpperCase() === "RESOLVED").length,
            bgGradient: "from-emerald-500 to-teal-600",
            iconBg: "from-emerald-100 to-teal-100",
            iconColor: "text-emerald-700",
            onClick: () => navigate("/mla/dashboard/road-reports"),
        },
        {
            title: "Help Requests",
            description: "View all citizen help requests from your district",
            icon: Users,
            count: helpRequests.length,
            pendingCount: helpRequests.filter(h => h.status?.toUpperCase() === "ACTIVE" || h.status?.toUpperCase() === "PENDING").length,
            resolvedCount: helpRequests.filter(h => h.status?.toUpperCase() === "RESOLVED").length,
            bgGradient: "from-cyan-500 to-blue-600",
            iconBg: "from-cyan-100 to-blue-100",
            iconColor: "text-cyan-700",
            onClick: () => {
                // Navigate to help requests page (to be created later)
                alert("Help Requests page coming soon!");
            },
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 -m-6 px-6 py-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">District Reports</h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <MapIcon className="w-4 h-4" />
                    All reports from {profile?.district}, {profile?.state}
                </p>
            </div>

            {/* Report Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {reportsData.map((report, idx) => {
                    const Icon = report.icon;
                    return (
                        <div
                            key={idx}
                            onClick={report.onClick}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                        >
                            {/* Gradient Header */}
                            <div className={`bg-gradient-to-r ${report.bgGradient} p-6 text-white relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

                                <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`w-14 h-14 bg-gradient-to-br ${report.iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
                                            <Icon className={`w-7 h-7 ${report.iconColor}`} />
                                        </div>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </div>

                                    <h2 className="text-2xl font-bold mb-1">{report.title}</h2>
                                    <p className="text-white/90 text-sm">{report.description}</p>
                                </div>
                            </div>

                            {/* Stats Section */}
                            <div className="p-6">
                                {/* Total Count */}
                                <div className="mb-6">
                                    <div className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                                        {report.count}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Reports</div>
                                </div>

                                {/* Status Breakdown */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertCircle className="w-4 h-4 text-amber-600" />
                                            <span className="text-xs font-medium text-amber-700">Pending</span>
                                        </div>
                                        <div className="text-2xl font-bold text-amber-900">{report.pendingCount}</div>
                                    </div>

                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-emerald-600" />
                                            <span className="text-xs font-medium text-emerald-700">Resolved</span>
                                        </div>
                                        <div className="text-2xl font-bold text-emerald-900">{report.resolvedCount}</div>
                                    </div>
                                </div>

                                {/* View Details Button */}
                                <button
                                    className={`w-full mt-6 bg-gradient-to-r ${report.bgGradient} text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2`}
                                >
                                    <span>View All {report.title}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Stats Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Summary Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="text-2xl font-bold text-gray-900">{roadReports.length + helpRequests.length}</div>
                        <div className="text-sm text-gray-600">Total Issues</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-amber-600">
                            {roadReports.filter(r => r.status?.toUpperCase() === "ACTIVE" || r.status?.toUpperCase() === "PENDING").length +
                                helpRequests.filter(h => h.status?.toUpperCase() === "ACTIVE" || h.status?.toUpperCase() === "PENDING").length}
                        </div>
                        <div className="text-sm text-gray-600">Pending</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-blue-600">
                            {roadReports.filter(r => r.status?.toUpperCase() === "IN_PROGRESS").length +
                                helpRequests.filter(h => h.status?.toUpperCase() === "IN_PROGRESS").length}
                        </div>
                        <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-emerald-600">
                            {roadReports.filter(r => r.status?.toUpperCase() === "RESOLVED").length +
                                helpRequests.filter(h => h.status?.toUpperCase() === "RESOLVED").length}
                        </div>
                        <div className="text-sm text-gray-600">Resolved</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MLADistrictReports;
