import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthProvider";
import { databases } from "@/services/appwriteConfig";
import { Query } from "appwrite";
import { Link } from "react-router-dom";
import {
    Briefcase,
    Calendar,
    User,
    Building,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    ArrowLeft,
    FileText,
    Wrench,
    Package
} from "lucide-react";

const MLAWorkOrders = () => {
    const { profile } = useContext(AuthContext);

    // Fetch all work orders created by this MLA
    const { data: workOrders = [], isLoading } = useQuery({
        queryKey: ["mla-work-orders", profile?.$id],
        queryFn: async () => {
            if (!profile?.name) return [];

            console.log("🔍 Fetching work orders for MLA:", profile.name);

            const response = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_WORK_ORDERS_COLLECTION_ID,
                [
                    Query.equal("mlaName", profile.name),
                    Query.orderDesc("assignedAt"),
                    Query.limit(100)
                ]
            );

            console.log("✅ Work orders fetched:", response.documents);
            return response.documents;
        },
        enabled: !!profile?.name,
    });

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "accepted": return "bg-blue-100 text-blue-700 border-blue-300";
            case "in_progress": return "bg-red-100 text-red-700 border-red-300";
            case "completed": return "bg-green-100 text-green-700 border-green-300";
            case "rejected": return "bg-red-100 text-red-700 border-red-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "low": return "bg-gray-100 text-gray-700 border-gray-300";
            case "medium": return "bg-blue-100 text-blue-700 border-blue-300";
            case "high": return "bg-orange-100 text-orange-700 border-orange-300";
            case "urgent": return "bg-red-100 text-red-700 border-red-300";
            case "critical": return "bg-rose-100 text-rose-700 border-rose-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const formatDepartment = (dept) => {
        if (!dept) return "Unknown";
        return dept.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const stats = {
        total: workOrders.length,
        pending: workOrders.filter(o => o.status === "pending").length,
        inProgress: workOrders.filter(o => o.status === "in_progress").length,
        completed: workOrders.filter(o => o.status === "completed").length,
        rejected: workOrders.filter(o => o.status === "rejected").length,
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading work orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-rose-50">
            {/* Header */}
            <div className="bg-white shadow-md border-b border-red-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                to="/mla/dashboard"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <Briefcase className="w-8 h-8 text-red-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Work Orders</h1>
                                <p className="text-sm text-gray-600">Track department work order progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex items-center gap-3">
                            <Briefcase className="w-8 h-8 text-gray-600" />
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-xs text-gray-600">Total</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex items-center gap-3">
                            <Clock className="w-8 h-8 text-yellow-600" />
                            <div>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                                <p className="text-xs text-gray-600">Pending</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex items-center gap-3">
                            <Wrench className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats.inProgress}</p>
                                <p className="text-xs text-gray-600">In Progress</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                                <p className="text-xs text-gray-600">Completed</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-4">
                        <div className="flex items-center gap-3">
                            <XCircle className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
                                <p className="text-xs text-gray-600">Rejected</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Work Orders List */}
                {workOrders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-md p-12 text-center">
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Work Orders Yet</h3>
                        <p className="text-gray-600">
                            You haven't assigned any work orders to departments yet.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {workOrders.map((order) => (
                            <div
                                key={order.$id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-mono text-gray-500">
                                                    {order.workOrderId}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(order.priorityLevel)}`}>
                                                    {order.priorityLevel?.toUpperCase()}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                    {order.status?.replace(/_/g, " ").toUpperCase()}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-700 mb-2">
                                                <Building className="w-4 h-4" />
                                                <span className="font-semibold">{formatDepartment(order.assignedDepartment)}</span>
                                            </div>

                                            <p className="text-gray-800 mb-3 leading-relaxed">
                                                <span className="font-semibold">Your Instructions:</span> {order.mlaInstructions}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>Assigned: {formatDate(order.assignedAt)}</span>
                                                </div>
                                                {order.estimatedCompletionDate && (
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>Due: {formatDate(order.estimatedCompletionDate)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Official Response Section */}
                                    {(order.officialNotes || order.issuesFaced || order.resourcesNeeded || order.rejectionReason) && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <h4 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Official Response
                                            </h4>

                                            <div className="bg-red-50 rounded-lg p-4 space-y-3">
                                                {/* Progress Notes */}
                                                {order.officialNotes && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                                            <FileText className="w-3 h-3" />
                                                            Progress Notes
                                                        </p>
                                                        <p className="text-sm text-red-900">{order.officialNotes}</p>
                                                    </div>
                                                )}

                                                {/* Estimated Completion */}
                                                {order.officialEstimatedCompletion && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            Estimated Completion
                                                        </p>
                                                        <p className="text-sm text-red-900">{formatDate(order.officialEstimatedCompletion)}</p>
                                                    </div>
                                                )}

                                                {/* Issues Faced */}
                                                {order.issuesFaced && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" />
                                                            Issues / Challenges
                                                        </p>
                                                        <p className="text-sm text-orange-900">{order.issuesFaced}</p>
                                                    </div>
                                                )}

                                                {/* Resources Needed */}
                                                {order.resourcesNeeded && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-1">
                                                            <Package className="w-3 h-3" />
                                                            Resources Needed
                                                        </p>
                                                        <p className="text-sm text-blue-900">{order.resourcesNeeded}</p>
                                                    </div>
                                                )}

                                                {/* Rejection Reason */}
                                                {order.rejectionReason && (
                                                    <div>
                                                        <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1">
                                                            <XCircle className="w-3 h-3" />
                                                            Rejection Reason
                                                        </p>
                                                        <p className="text-sm text-red-900">{order.rejectionReason}</p>
                                                    </div>
                                                )}

                                                {/* Status Timestamps */}
                                                <div className="pt-2 border-t border-red-200 flex flex-wrap gap-3 text-xs text-red-700">
                                                    {order.acceptedAt && (
                                                        <span>✓ Accepted: {formatDate(order.acceptedAt)}</span>
                                                    )}
                                                    {order.startedAt && (
                                                        <span>🔧 Started: {formatDate(order.startedAt)}</span>
                                                    )}
                                                    {order.completedAt && (
                                                        <span>✅ Completed: {formatDate(order.completedAt)}</span>
                                                    )}
                                                    {order.rejectedAt && (
                                                        <span>❌ Rejected: {formatDate(order.rejectedAt)}</span>
                                                    )}
                                                    {order.updatedAt && (
                                                        <span>🔄 Last Updated: {formatDate(order.updatedAt)}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* No Response Yet */}
                                    {!order.officialNotes && !order.issuesFaced && !order.resourcesNeeded && !order.rejectionReason && order.status === "pending" && (
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <div className="bg-yellow-50 rounded-lg p-4 flex items-center gap-3">
                                                <Clock className="w-5 h-5 text-yellow-600" />
                                                <p className="text-sm text-yellow-800">
                                                    Waiting for official response...
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MLAWorkOrders;
