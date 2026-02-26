import { useQuery } from "@tanstack/react-query";
import { databases } from "@/services/appwriteConfig";
import { Query } from "appwrite";
import { Link } from "react-router-dom";
import { Users, FileText, Shield, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";

const AdminHome = () => {
    // Fetch all users
    const { data: allUsers = [] } = useQuery({
        queryKey: ["admin-all-users"],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_USERS_COLLECTION_ID
            );
            return res.documents;
        },
    });

    // Fetch all road reports
    const { data: allReports = [] } = useQuery({
        queryKey: ["admin-all-reports"],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID
            );
            return res.documents;
        },
    });

    // Fetch MLA applications
    const { data: mlaApplications = [] } = useQuery({
        queryKey: ["admin-mla-applications"],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID
            );
            return res.documents;
        },
    });

    // Calculate stats
    const totalUsers = allUsers.length;
    const citizens = allUsers.filter(u => u.role === "citizen").length;
    const mlas = allUsers.filter(u => u.role === "mla").length;
    const officials = allUsers.filter(u => u.role === "official").length;
    const admins = allUsers.filter(u => u.role === "admin").length;

    const totalReports = allReports.length;
    const activeReports = allReports.filter(r => r.status === "ACTIVE").length;
    const resolvedReports = allReports.filter(r => r.status === "RESOLVED").length;

    const pendingMLAs = mlaApplications.filter(a => a.verificationStatus === "pending").length;

    const stats = [
        {
            label: "Total Users",
            value: totalUsers,
            subtext: `${citizens} Citizens, ${mlas} MLAs, ${officials} Officials`,
            icon: Users,
            color: "bg-blue-500",
            lightColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            label: "Road Reports",
            value: totalReports,
            subtext: `${activeReports} Active, ${resolvedReports} Resolved`,
            icon: FileText,
            color: "bg-green-500",
            lightColor: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            label: "Pending Applications",
            value: pendingMLAs,
            subtext: "Awaiting review",
            icon: AlertCircle,
            color: "bg-orange-500",
            lightColor: "bg-orange-50",
            textColor: "text-orange-600",
        },
        {
            label: "Resolution Rate",
            value: totalReports > 0 ? `${Math.round((resolvedReports / totalReports) * 100)}%` : "0%",
            subtext: `${resolvedReports} of ${totalReports} resolved`,
            icon: TrendingUp,
            color: "bg-purple-500",
            lightColor: "bg-purple-50",
            textColor: "text-purple-600",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening in your system.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-sm font-medium text-gray-700 mb-1">{stat.label}</div>
                            <div className="text-xs text-gray-500">{stat.subtext}</div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #EA2264, #D11D58, #B5174C)' }}>
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/users"
                        className="p-4 bg-white/90 backdrop-blur rounded-lg border-2 border-white/30 hover:bg-white hover:shadow-lg hover:scale-[1.02] transition-all group"
                    >
                        <Users className="w-6 h-6 mb-2" style={{ color: '#EA2264' }} />
                        <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
                        <p className="text-sm text-gray-600">View and manage all system users</p>
                    </Link>

                    <Link
                        to="/admin/mla-applications"
                        className="p-4 bg-white/90 backdrop-blur rounded-lg border-2 border-white/30 hover:bg-white hover:shadow-lg hover:scale-[1.02] transition-all group"
                    >
                        <AlertCircle className="w-6 h-6 mb-2" style={{ color: '#EA2264' }} />
                        <h3 className="font-semibold text-gray-900 mb-1">Review Applications</h3>
                        <p className="text-sm text-gray-600">{pendingMLAs} pending applications</p>
                    </Link>

                    <Link
                        to="/dashboard/road-reports/all"
                        className="p-4 bg-white/90 backdrop-blur rounded-lg border-2 border-white/30 hover:bg-white hover:shadow-lg hover:scale-[1.02] transition-all group"
                    >
                        <FileText className="w-6 h-6 mb-2" style={{ color: '#EA2264' }} />
                        <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
                        <p className="text-sm text-gray-600">All road reports across India</p>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Road Reports</h2>
                <div className="space-y-3">
                    {allReports.slice(0, 5).map((report) => (
                        <div
                            key={report.$id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${report.status === "ACTIVE" ? "bg-green-500" : "bg-gray-400"}`}></div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">
                                        {report.fromPlace} → {report.toPlace}
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        {report.district}, {report.state} • {report.condition}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{report.likes} likes</p>
                                <p className="text-xs text-gray-500">{report.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
