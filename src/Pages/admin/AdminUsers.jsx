import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases } from "@/services/appwriteConfig";
import { Query } from "appwrite";
import {
    Users, Mail, Phone, MapPin, Calendar, Shield,
    Search, Filter, UserCheck, UserX, Eye,
    AlertCircle, Trash2, Edit
} from "lucide-react";

const AdminUsers = () => {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch all users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ["all-users"],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_USERS_COLLECTION_ID,
                [Query.orderDesc("$createdAt")]
            );
            return res.documents;
        },
    });

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesRole = selectedRole === "all" || user.role === selectedRole;
        const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user.phone && user.phone.includes(searchQuery)) ||
            (user.district && user.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (user.state && user.state.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesRole && matchesStatus && matchesSearch;
    });

    // Update user status mutation
    const updateStatusMutation = useMutation({
        mutationFn: async ({ userId, newStatus }) => {
            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_USERS_COLLECTION_ID,
                userId,
                { status: newStatus }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["all-users"]);
            alert("✅ User status updated successfully!");
        },
        onError: (error) => {
            alert(`❌ Error: ${error.message}`);
        },
    });

    // Delete user mutation
    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            await databases.deleteDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_USERS_COLLECTION_ID,
                userId
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["all-users"]);
            setIsModalOpen(false);
            alert("✅ User deleted successfully!");
        },
        onError: (error) => {
            alert(`❌ Error: ${error.message}`);
        },
    });

    const handleToggleStatus = (user) => {
        const newStatus = user.status === "active" ? "inactive" : "active";
        if (window.confirm(`Are you sure you want to ${newStatus === "active" ? "activate" : "deactivate"} ${user.name}?`)) {
            updateStatusMutation.mutate({ userId: user.$id, newStatus });
        }
    };

    const handleDeleteUser = (user) => {
        if (window.confirm(`⚠️ Are you sure you want to DELETE ${user.name}? This action cannot be undone!`)) {
            deleteUserMutation.mutate(user.$id);
        }
    };

    const getRoleBadge = (role) => {
        const configs = {
            citizen: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
            mla: { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
            admin: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
        };
        const config = configs[role] || configs.citizen;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} text-xs font-medium uppercase`}>
                {role}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const isActive = status === "active";
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${isActive
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }`}>
                {isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                {status}
            </span>
        );
    };

    const stats = [
        { label: "Total Users", value: users.length, color: "bg-blue-500", icon: Users },
        { label: "Citizens", value: users.filter(u => u.role === "citizen").length, color: "bg-blue-500", icon: Users },
        { label: "MLAs", value: users.filter(u => u.role === "mla").length, color: "bg-purple-500", icon: Shield },
        { label: "Active", value: users.filter(u => u.status === "active").length, color: "bg-green-500", icon: UserCheck },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
                <p className="text-gray-600">View and manage all registered users</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200">
                            <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, phone, location..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Role Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
                        >
                            <option value="all">All Roles</option>
                            <option value="citizen">Citizens</option>
                            <option value="mla">MLAs</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white min-w-[150px]"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.$id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold text-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-600">{user.email}</div>
                                                    {user.phone && (
                                                        <div className="text-xs text-gray-500">{user.phone}</div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                {user.district && (
                                                    <div className="font-medium text-gray-900">{user.district}</div>
                                                )}
                                                {user.state && (
                                                    <div className="text-gray-600">{user.state}</div>
                                                )}
                                                {!user.district && !user.state && (
                                                    <span className="text-gray-400">—</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {new Date(user.$createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(user)}
                                                    className={`p-2 rounded-lg transition ${user.status === "active"
                                                            ? "text-yellow-600 hover:bg-yellow-50"
                                                            : "text-green-600 hover:bg-green-50"
                                                        }`}
                                                    title={user.status === "active" ? "Deactivate User" : "Activate User"}
                                                >
                                                    {user.status === "active" ? (
                                                        <UserX className="w-4 h-4" />
                                                    ) : (
                                                        <UserCheck className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* User Detail Modal */}
            {isModalOpen && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* User Avatar & Basic Info */}
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-2xl">
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {getRoleBadge(selectedUser.role)}
                                        {getStatusBadge(selectedUser.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-600" />
                                    Contact Information
                                </h3>
                                <div className="grid grid-cols-1 gap-3 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Email</div>
                                        <div className="font-medium text-gray-900">{selectedUser.email}</div>
                                    </div>
                                    {selectedUser.phone && (
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Phone</div>
                                            <div className="font-medium text-gray-900">{selectedUser.phone}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location Information */}
                            {(selectedUser.state || selectedUser.district) && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-600" />
                                        Location
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        {selectedUser.state && (
                                            <div>
                                                <div className="text-xs text-gray-600 mb-1">State</div>
                                                <div className="font-medium text-gray-900">{selectedUser.state}</div>
                                            </div>
                                        )}
                                        {selectedUser.district && (
                                            <div>
                                                <div className="text-xs text-gray-600 mb-1">District</div>
                                                <div className="font-medium text-gray-900">{selectedUser.district}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Account Information */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-600" />
                                    Account Information
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">User ID</div>
                                        <div className="font-mono text-xs text-gray-900">{selectedUser.$id}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Joined On</div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(selectedUser.$createdAt).toLocaleString("en-IN", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </div>
                                    </div>
                                    {selectedUser.$updatedAt && (
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Last Updated</div>
                                            <div className="font-medium text-gray-900">
                                                {new Date(selectedUser.$updatedAt).toLocaleString("en-IN", {
                                                    day: "2-digit",
                                                    month: "long",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                            <button
                                onClick={() => handleToggleStatus(selectedUser)}
                                className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${selectedUser.status === "active"
                                        ? "bg-white border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg"
                                    }`}
                            >
                                {selectedUser.status === "active" ? (
                                    <>
                                        <UserX className="w-5 h-5" />
                                        Deactivate User
                                    </>
                                ) : (
                                    <>
                                        <UserCheck className="w-5 h-5" />
                                        Activate User
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => handleDeleteUser(selectedUser)}
                                className="px-6 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition flex items-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
