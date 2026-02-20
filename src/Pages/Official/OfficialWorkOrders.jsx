import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "@/context/AuthProvider";
import { getWorkOrdersByDepartment, updateWorkOrderStatus } from "@/services/workOrderService";
import {
    Briefcase,
    Calendar,
    User,
    MapPin,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
    Filter,
    Search
} from "lucide-react";

const OfficialWorkOrders = () => {
    const { profile } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedPriority, setSelectedPriority] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fetch work orders for official's department
    const { data: workOrders = [], isLoading } = useQuery({
        queryKey: ["official-work-orders", profile?.department],
        queryFn: async () => {
            if (!profile?.department) return [];
            return await getWorkOrdersByDepartment(profile.department);
        },
        enabled: !!profile?.department,
    });

    // Mutation to update work order status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ workOrderId, status, additionalData }) => {
            return await updateWorkOrderStatus(workOrderId, status, additionalData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["official-work-orders"]);
            alert("Work order status updated successfully!");
            setSelectedOrder(null);
        },
        onError: (error) => {
            console.error("Error updating status:", error);
            alert("Error updating status: " + error.message);
        },
    });

    // Filter work orders
    const filteredOrders = workOrders.filter(order => {
        const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
        const matchesPriority = selectedPriority === "all" || order.priorityLevel === selectedPriority;
        const matchesSearch = searchTerm === "" ||
            order.mlaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.mlaInstructions?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.workOrderId?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesPriority && matchesSearch;
    });

    // Status counts
    const statusCounts = {
        all: workOrders.length,
        pending: workOrders.filter(o => o.status === "pending").length,
        accepted: workOrders.filter(o => o.status === "accepted").length,
        in_progress: workOrders.filter(o => o.status === "in_progress").length,
        completed: workOrders.filter(o => o.status === "completed").length,
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

    const getStatusColor = (status) => {
        switch (status) {
            case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "accepted": return "bg-blue-100 text-blue-700 border-blue-300";
            case "in_progress": return "bg-amber-100 text-amber-700 border-amber-300";
            case "completed": return "bg-green-100 text-green-700 border-green-300";
            case "rejected": return "bg-red-100 text-red-700 border-red-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const handleStatusUpdate = (newStatus) => {
        if (!selectedOrder) return;

        const additionalData = {};

        if (newStatus === "rejected") {
            const reason = prompt("Please provide a reason for rejection:");
            if (!reason) return;
            additionalData.rejectionReason = reason;
        }

        updateStatusMutation.mutate({
            workOrderId: selectedOrder.$id,
            status: newStatus,
            additionalData,
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Loading work orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header + Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Work Orders
                        </h1>
                        <p className="text-gray-600">
                            Department: <span className="font-semibold text-amber-600">
                                {profile?.department?.replace(/_/g, " ")}
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-10 h-10 text-amber-500" />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <button
                        onClick={() => setSelectedStatus("all")}
                        className={`p-3 rounded-lg border-2 transition ${selectedStatus === "all"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
                        <div className="text-xs text-gray-600">All Orders</div>
                    </button>
                    <button
                        onClick={() => setSelectedStatus("pending")}
                        className={`p-3 rounded-lg border-2 transition ${selectedStatus === "pending"
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                        <div className="text-xs text-gray-600">Pending</div>
                    </button>
                    <button
                        onClick={() => setSelectedStatus("accepted")}
                        className={`p-3 rounded-lg border-2 transition ${selectedStatus === "accepted"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-2xl font-bold text-blue-600">{statusCounts.accepted}</div>
                        <div className="text-xs text-gray-600">Accepted</div>
                    </button>
                    <button
                        onClick={() => setSelectedStatus("in_progress")}
                        className={`p-3 rounded-lg border-2 transition ${selectedStatus === "in_progress"
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-2xl font-bold text-amber-600">{statusCounts.in_progress}</div>
                        <div className="text-xs text-gray-600">In Progress</div>
                    </button>
                    <button
                        onClick={() => setSelectedStatus("completed")}
                        className={`p-3 rounded-lg border-2 transition ${selectedStatus === "completed"
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                            }`}
                    >
                        <div className="text-2xl font-bold text-green-600">{statusCounts.completed}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by MLA name, work order ID, or instructions..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                    </div>

                    {/* Priority Filter */}
                    <div className="md:w-48">
                        <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Work Orders List */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Work Orders Found</h3>
                    <p className="text-gray-600">
                        {searchTerm || selectedStatus !== "all" || selectedPriority !== "all"
                            ? "Try adjusting your filters"
                            : "No work orders have been assigned to your department yet"}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredOrders.map((order) => (
                        <div
                            key={order.$id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
                        >
                            <div className="p-6">
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
                                            <User className="w-4 h-4" />
                                            <span className="font-semibold">{order.mlaName}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-sm">{order.mlaConstituency}</span>
                                        </div>

                                        <p className="text-gray-800 mb-3 leading-relaxed">
                                            {order.mlaInstructions}
                                        </p>

                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Assigned: {new Date(order.assignedAt).toLocaleDateString()}</span>
                                            </div>
                                            {order.estimatedCompletionDate && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>Due: {new Date(order.estimatedCompletionDate).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                                    {order.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    handleStatusUpdate("accepted");
                                                }}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    handleStatusUpdate("rejected");
                                                }}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}
                                    {order.status === "accepted" && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                handleStatusUpdate("in_progress");
                                            }}
                                            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition flex items-center gap-2"
                                        >
                                            <Clock className="w-4 h-4" />
                                            Start Work
                                        </button>
                                    )}
                                    {order.status === "in_progress" && (
                                        <button
                                            onClick={() => {
                                                setSelectedOrder(order);
                                                handleStatusUpdate("completed");
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Mark Complete
                                        </button>
                                    )}
                                    {order.status === "completed" && (
                                        <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-medium">Completed</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OfficialWorkOrders;
