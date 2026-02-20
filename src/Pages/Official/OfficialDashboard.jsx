import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthProvider";
import { getWorkOrdersByDepartment } from "@/services/workOrderService";
import { Link } from "react-router-dom";
import {
    Briefcase,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Calendar,
    User,
    ArrowUpRight
} from "lucide-react";

const OfficialDashboard = () => {
    const { profile } = useContext(AuthContext);

    // Fetch work orders for official's department
    const { data: workOrders = [], isLoading } = useQuery({
        queryKey: ["official-work-orders-stats", profile?.department],
        queryFn: async () => {
            if (!profile?.department) return [];
            return await getWorkOrdersByDepartment(profile.department);
        },
        enabled: !!profile?.department,
    });

    // Calculate stats
    const stats = {
        total: workOrders.length,
        pending: workOrders.filter(o => o.status === "pending").length,
        inProgress: workOrders.filter(o => o.status === "in_progress").length,
        completed: workOrders.filter(o => o.status === "completed").length,
        highPriority: workOrders.filter(o => o.priorityLevel === "high" || o.priorityLevel === "urgent" || o.priorityLevel === "critical").length,
    };

    // Recent work orders (last 5)
    const recentOrders = [...workOrders]
        .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
        .slice(0, 5);

    const statCards = [
        {
            label: "Total Work Orders",
            value: stats.total,
            icon: Briefcase,
            color: "bg-amber-500",
            bgColor: "bg-amber-50",
            textColor: "text-amber-600",
        },
        {
            label: "Pending Action",
            value: stats.pending,
            icon: AlertCircle,
            color: "bg-yellow-500",
            bgColor: "bg-yellow-50",
            textColor: "text-yellow-600",
        },
        {
            label: "In Progress",
            value: stats.inProgress,
            icon: Clock,
            color: "bg-blue-500",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            label: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "bg-green-500",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome, {profile?.name || "Official"}!
                </h1>
                <p className="text-gray-600 mt-1">
                    Department: <span className="font-semibold text-amber-600">
                        {profile?.department?.replace(/_/g, " ") || "Unknown"}
                    </span>
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-5 h-5 ${stat.textColor}`} />
                                </div>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                        </div>
                    );
                })}
            </div>

            {/* Department Info Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl p-6 text-white mb-6 shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Briefcase className="w-5 h-5" />
                            Your Department
                        </h2>
                        <p className="text-amber-100 mt-1">
                            {profile?.department?.replace(/_/g, " ") || "Unknown Department"} — {profile?.district || "District N/A"}
                        </p>
                        <div className="flex gap-4 mt-3">
                            <div>
                                <span className="text-2xl font-bold">{stats.total}</span>
                                <span className="text-amber-100 text-sm ml-1">Total Orders</span>
                            </div>
                            <div className="border-l border-amber-300 pl-4">
                                <span className="text-2xl font-bold">{stats.completed}</span>
                                <span className="text-amber-100 text-sm ml-1">Completed</span>
                            </div>
                        </div>
                    </div>
                    <ArrowUpRight className="w-10 h-10 text-amber-200" />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
                <Link
                    to="/official/dashboard/work-orders"
                    className="p-4 border-2 border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition text-left"
                >
                    <Briefcase className="w-6 h-6 text-amber-600 mb-2" />
                    <div className="font-semibold text-gray-900">View Work Orders</div>
                    <div className="text-sm text-gray-600">Manage and update work order status</div>
                </Link>
                <Link
                    to="/official/dashboard/profile"
                    className="p-4 border-2 border-amber-200 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition text-left"
                >
                    <User className="w-6 h-6 text-amber-600 mb-2" />
                    <div className="font-semibold text-gray-900">View Profile</div>
                    <div className="text-sm text-gray-600">Your official profile details</div>
                </Link>
            </div>

            {/* Recent Work Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Recent Work Orders</h2>
                    <Link
                        to="/official/dashboard/work-orders"
                        className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                    >
                        View All →
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-10">
                        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-600">No work orders assigned yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <div
                                key={order.$id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 hover:shadow-sm transition"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-mono text-gray-500">
                                                {order.workOrderId}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                    order.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                                                        order.status === "completed" ? "bg-green-100 text-green-700" :
                                                            "bg-gray-100 text-gray-700"
                                                }`}>
                                                {order.status?.replace(/_/g, " ").toUpperCase()}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.priorityLevel === "critical" || order.priorityLevel === "urgent" ? "bg-red-100 text-red-700" :
                                                    order.priorityLevel === "high" ? "bg-orange-100 text-orange-700" :
                                                        "bg-blue-100 text-blue-700"
                                                }`}>
                                                {order.priorityLevel?.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 mb-2 line-clamp-2">
                                            {order.mlaInstructions}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-gray-600">
                                            <span>From: {order.mlaName}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(order.assignedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficialDashboard;
