import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { AuthContext } from "@/context/AuthProvider";
import {
    Search,
    Filter,
    AlertCircle,
    Users,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { HELP_CATEGORIES_ARRAY } from "@/constants/helpRequestConstants";
import MLAHelpRequestCard from "./MLAHelpRequestCard";

const MLAHelpRequests = () => {
    const { profile } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [selectedPriority, setSelectedPriority] = useState("ALL");

    // Fetch help requests from MLA's district
    const { data: helpRequests = [], isLoading, refetch } = useQuery({
        queryKey: ["mla-help-requests", profile?.district],
        queryFn: async () => {
            if (!profile?.district) return [];

            // Fetch all requests and filter client-side for case-insensitive matching
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
                [Query.orderDesc("$createdAt"), Query.limit(200)]
            );

            // Filter case-insensitively
            return res.documents.filter(
                (doc) => doc.district?.toLowerCase() === profile.district?.toLowerCase()
            );
        },
        enabled: !!profile?.district,
    });

    // Filter requests
    const filteredRequests = helpRequests.filter((request) => {
        const matchesSearch =
            request.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            request.mandal?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "ALL" || request.category === selectedCategory;

        const matchesStatus =
            selectedStatus === "ALL" || request.status === selectedStatus;

        const matchesPriority =
            selectedPriority === "ALL" || request.priority === selectedPriority;

        return matchesSearch && matchesCategory && matchesStatus && matchesPriority;
    });

    // Calculate stats
    const stats = {
        total: helpRequests.length,
        pending: helpRequests.filter((r) => r.status === "PENDING").length,
        inProgress: helpRequests.filter((r) => r.status === "IN_PROGRESS").length,
        resolved: helpRequests.filter((r) => r.status === "RESOLVED").length,
        rejected: helpRequests.filter((r) => r.status === "REJECTED").length,
    };

    if (isLoading) {
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
                <h1 className="text-3xl font-bold text-gray-900">Help Requests</h1>
                <p className="text-gray-600 mt-1">
                    Manage community help requests from {profile?.district}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-cyan-600" />
                        <span className="text-sm text-gray-600">In Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-cyan-600">{stats.inProgress}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-gray-600">Resolved</span>
                    </div>
                    <div className="text-2xl font-bold text-emerald-600">{stats.resolved}</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span className="text-sm text-gray-600">Rejected</span>
                    </div>
                    <div className="text-2xl font-bold text-rose-600">{stats.rejected}</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search requests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Category Filter */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="ALL">All Categories</option>
                        {HELP_CATEGORIES_ARRAY.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.icon} {cat.label}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="ACKNOWLEDGED">Acknowledged</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    {/* Priority Filter */}
                    <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>
            </div>

            {/* Results */}
            {filteredRequests.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                        {searchTerm || selectedCategory !== "ALL" || selectedStatus !== "ALL"
                            ? "No requests match your filters"
                            : "No help requests yet from your constituency"}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Showing {filteredRequests.length} of {helpRequests.length} requests
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredRequests.map((request) => (
                            <MLAHelpRequestCard
                                key={request.$id}
                                request={request}
                                onUpdate={refetch}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MLAHelpRequests;
