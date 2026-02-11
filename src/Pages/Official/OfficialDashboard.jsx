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
    User
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
            title: "Total Work Orders",
            value: stats.total,
            icon: Briefcase,
            color: "yellow",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600",
            borderColor: "border-yellow-300"
        },
        {
            title: "Pending Action",
            value: stats.pending,
            icon: AlertCircle,
            color: "yellow",
            bgColor: "bg-yellow-100",
            textColor: "text-yellow-600",
            borderColor: "border-yellow-300"
        },
        {
            title: "In Progress",
            value: stats.inProgress,
            icon: Clock,
            color: "blue",
            bgColor: "bg-blue-100",
            textColor: "text-blue-600",
            borderColor: "border-blue-300"
        },
        {
            title: "Completed",
            value: stats.completed,
            icon: CheckCircle,
            color: "green",
            bgColor: "bg-green-100",
            textColor: "text-green-600",
            borderColor: "border-green-300"
        },
        {
            title: "High Priority",
            value: stats.highPriority,
            icon: TrendingUp,
            color: "red",
            bgColor: "bg-red-100",
            textColor: "text-red-600",
            borderColor: "border-red-300"
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

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
                                to="/official/profile"
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-yellow-600 transition"
                            >
                                <User className="w-5 h-5" />
                                <span className="font-medium">Profile</span>
                            </Link>
                            <button
                                onClick={() => {
                                    // Logout logic
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    window.location.href = "/";
                                }}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">
                                Welcome, {profile?.name || "Official"}!
                            </h1>
                            <p className="text-gray-600">
                                Department: <span className="font-semibold text-yellow-600">
                                    {profile?.department?.replace(/_/g, " ") || "Unknown"}
                                </span>
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-16 h-16 text-yellow-600" />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {statCards.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${stat.borderColor} hover:shadow-lg transition-all duration-200`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                        <Icon className={`w-6 h-6 ${stat.textColor}`} />
                                    </div>
                                    <div className={`text-3xl font-bold ${stat.textColor}`}>
                                        {stat.value}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <Link
                        to="/official/work-orders"
                        className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 group"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">View All Work Orders</h3>
                                <p className="text-yellow-100">
                                    Manage and update work order status
                                </p>
                            </div>
                            <Briefcase className="w-12 h-12 group-hover:scale-110 transition-transform" />
                        </div>
                    </Link>

                    {stats.pending > 0 && (
                        <Link
                            to="/official/work-orders"
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Pending Actions</h3>
                                    <p className="text-yellow-100">
                                        {stats.pending} work {stats.pending === 1 ? "order needs" : "orders need"} your attention
                                    </p>
                                </div>
                                <AlertCircle className="w-12 h-12 group-hover:scale-110 transition-transform" />
                            </div>
                        </Link>
                    )}
                </div>

                {/* Recent Work Orders */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Work Orders</h2>
                        <Link
                            to="/official/work-orders"
                            className="text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                        >
                            View All →
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600">No work orders assigned yet</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <div
                                    key={order.$id}
                                    className="border border-gray-200 rounded-lg p-4 hover:border-yellow-300 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-mono text-gray-500">
                                                    {order.workOrderId}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                                    order.status === "in_progress" ? "bg-purple-100 text-purple-700" :
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
        </div>
    );
};

export default OfficialDashboard;
