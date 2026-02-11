import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, account, ID } from "@/services/appwriteConfig";
import { Query } from "appwrite";
import {
    FileText, User, Mail, Phone, MapPin, Building2,
    CheckCircle, XCircle, Eye, Filter, Search,
    AlertCircle, Calendar, Shield, ExternalLink, Clock, Briefcase
} from "lucide-react";
import { DEPARTMENTS } from "@/constants/departmentConstants";

const MLAApplications = () => {
    const queryClient = useQueryClient();
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch all MLA applications
    const { data: applications = [], isLoading } = useQuery({
        queryKey: ["mla-applications"],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID,
                [Query.orderDesc("appliedAt")]
            );
            return res.documents;
        },
    });

    // Filter applications
    const filteredApplications = applications.filter((app) => {
        const matchesStatus = selectedStatus === "all" || app.verificationStatus === selectedStatus;
        const matchesSearch =
            app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.constituency.toLowerCase().includes(searchQuery.toLowerCase()) ||
            app.state.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    // Approve application mutation
    const approveMutation = useMutation({
        mutationFn: async (application) => {
            setIsProcessing(true);

            try {
                // 1. Create user account with THEIR ORIGINAL PASSWORD
                // No temp password - use the password they entered during registration!

                // Create Appwrite account
                const userAccount = await account.create(
                    ID.unique(),
                    application.email,
                    application.password, // Use stored password from registration
                    application.name
                );

                // 2. Create user profile in users collection
                // Determine role based on application type
                const userRole = application.officialType === "DEPARTMENT_OFFICIAL" ? "official" : "mla";

                const userProfileData = {
                    userId: userAccount.$id,
                    name: application.name,
                    email: application.email,
                    phone: application.phone,
                    state: application.state,
                    district: application.constituency,
                    role: userRole,
                    status: "active"
                };

                // Add department and designation for officials
                if (application.officialType === "DEPARTMENT_OFFICIAL") {
                    userProfileData.department = application.department;
                    userProfileData.designation = application.designation || "";
                }

                await databases.createDocument(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_USERS_COLLECTION_ID,
                    userAccount.$id,
                    userProfileData
                );

                // 5. Update application status
                await databases.updateDocument(
                    import.meta.env.VITE_DATABASE_ID,
                    import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID,
                    application.$id,
                    {
                        verificationStatus: "approved",
                        userId: userAccount.$id,
                        reviewedAt: new Date().toISOString()
                    }
                );

                return { email: application.email };
            } catch (error) {
                console.error("Approval error:", error);
                throw error;
            } finally {
                setIsProcessing(false);
            }
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries(["mla-applications"]);
            setIsModalOpen(false);
            const loginPath = selectedApplication.officialType === "DEPARTMENT_OFFICIAL" ? "/login" : "/mla/login";
            const roleLabel = selectedApplication.officialType === "DEPARTMENT_OFFICIAL" ? "Department Official" : "MLA";
            alert(`✅ Application approved!\n\nThe ${roleLabel} can now login at ${loginPath} using:\nEmail: ${data.email}\nPassword: (their original password)`);
        },
        onError: (error) => {
            alert(`❌ Error: ${error.message}`);
        }
    });

    // Reject application mutation
    const rejectMutation = useMutation({
        mutationFn: async (applicationId) => {
            setIsProcessing(true);

            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_APPLICATIONS_COLLECTION_ID,
                applicationId,
                {
                    verificationStatus: "rejected",
                    reviewedAt: new Date().toISOString()
                }
            );

            setIsProcessing(false);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["mla-applications"]);
            setIsModalOpen(false);
            alert("✅ Application rejected successfully.");
        },
        onError: (error) => {
            alert(`❌ Error: ${error.message}`);
            setIsProcessing(false);
        }
    });

    const handleApprove = () => {
        if (window.confirm(`Are you sure you want to APPROVE ${selectedApplication.name}'s application?`)) {
            approveMutation.mutate(selectedApplication);
        }
    };

    const handleReject = () => {
        if (window.confirm(`Are you sure you want to REJECT ${selectedApplication.name}'s application?`)) {
            rejectMutation.mutate(selectedApplication.$id);
        }
    };

    const getStatusBadge = (status) => {
        const configs = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300", icon: Clock },
            approved: { bg: "bg-green-100", text: "text-green-800", border: "border-green-300", icon: CheckCircle },
            rejected: { bg: "bg-red-100", text: "text-red-800", border: "border-red-300", icon: XCircle }
        };
        const config = configs[status] || configs.pending;
        const Icon = config.icon;

        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.text} ${config.border} text-xs font-medium`}>
                <Icon className="w-3.5 h-3.5" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const stats = [
        { label: "Total", value: applications.length, color: "bg-blue-500" },
        { label: "Pending", value: applications.filter(a => a.verificationStatus === "pending").length, color: "bg-yellow-500" },
        { label: "Approved", value: applications.filter(a => a.verificationStatus === "approved").length, color: "bg-green-500" },
        { label: "Rejected", value: applications.filter(a => a.verificationStatus === "rejected").length, color: "bg-red-500" }
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Government Official Applications</h1>
                <p className="text-gray-600">Review and manage MLA & Department Official registration requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-5 border border-gray-200">
                        <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, constituency, state..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white min-w-[180px]"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Applications List */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {filteredApplications.length === 0 ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-600">No applications found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Party/Dept</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applied</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredApplications.map((app) => (
                                    <tr key={app.$id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-bold text-sm">
                                                        {app.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{app.name}</div>
                                                    <div className="text-sm text-gray-600">{app.email}</div>
                                                    <div className="text-xs text-gray-500">{app.phone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${app.officialType === "DEPARTMENT_OFFICIAL"
                                                ? "bg-green-100 text-green-800 border border-green-300"
                                                : "bg-purple-100 text-purple-800 border border-purple-300"
                                                }`}>
                                                {app.officialType === "DEPARTMENT_OFFICIAL" ? (
                                                    <><Briefcase className="w-3 h-3" /> Official</>
                                                ) : (
                                                    <><Shield className="w-3 h-3" /> MLA</>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="font-medium text-gray-900">{app.constituency}</div>
                                                <div className="text-gray-600">{app.state}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {app.officialType === "DEPARTMENT_OFFICIAL" ? (
                                                <div className="text-sm">
                                                    <div className="font-medium text-gray-900">
                                                        {DEPARTMENTS[app.department]?.label || app.department}
                                                    </div>
                                                    {app.designation && (
                                                        <div className="text-xs text-gray-500">{app.designation}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-900 font-medium">
                                                    {app.partyName || "—"}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-600">
                                                {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric"
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(app.verificationStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedApplication(app);
                                                    setIsModalOpen(true);
                                                }}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:shadow-lg transition"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Review
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Application Detail Modal */}
            {isModalOpen && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-lg border ${selectedApplication.verificationStatus === "pending"
                                ? "bg-yellow-50 border-yellow-200"
                                : selectedApplication.verificationStatus === "approved"
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                                }`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        {getStatusBadge(selectedApplication.verificationStatus)}
                                    </div>
                                    {selectedApplication.reviewedAt && (
                                        <div className="text-xs text-gray-600">
                                            Reviewed: {new Date(selectedApplication.reviewedAt).toLocaleDateString("en-IN")}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Personal Details */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-600" />
                                    Personal Information
                                </h3>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Full Name</div>
                                        <div className="font-medium text-gray-900">{selectedApplication.name}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Email</div>
                                        <div className="font-medium text-gray-900 break-all">{selectedApplication.email}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Phone</div>
                                        <div className="font-medium text-gray-900">{selectedApplication.phone}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">Official Type</div>
                                        <div className="font-medium text-gray-900">
                                            {selectedApplication.officialType === "DEPARTMENT_OFFICIAL" ? "Department Official" : "MLA"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location Details */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-600" />
                                    {selectedApplication.officialType === "DEPARTMENT_OFFICIAL" ? "Location Information" : "Constituency Information"}
                                </h3>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">State</div>
                                        <div className="font-medium text-gray-900">{selectedApplication.state}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-600 mb-1">
                                            {selectedApplication.officialType === "DEPARTMENT_OFFICIAL" ? "District" : "Constituency"}
                                        </div>
                                        <div className="font-medium text-gray-900">{selectedApplication.constituency}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Department Details (for Officials only) */}
                            {selectedApplication.officialType === "DEPARTMENT_OFFICIAL" && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-gray-600" />
                                        Department Information
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Department</div>
                                            <div className="font-medium text-gray-900 flex items-center gap-2">
                                                {DEPARTMENTS[selectedApplication.department]?.icon}
                                                {DEPARTMENTS[selectedApplication.department]?.label || selectedApplication.department}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-gray-600 mb-1">Designation</div>
                                            <div className="font-medium text-gray-900">{selectedApplication.designation || "—"}</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Party Details (for MLAs only) */}
                            {selectedApplication.officialType !== "DEPARTMENT_OFFICIAL" && selectedApplication.partyName && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Shield className="w-4 h-4 text-gray-600" />
                                        Political Information
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-xs text-gray-600 mb-1">Political Party</div>
                                        <div className="font-medium text-gray-900">{selectedApplication.partyName}</div>
                                    </div>
                                </div>
                            )}

                            {/* ID Proof */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-600" />
                                    Government ID Proof
                                </h3>
                                <a
                                    href={selectedApplication.govtIdProof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View ID Proof Document
                                </a>
                            </div>

                            {/* Application Date */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-600" />
                                    Application Timeline
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="text-xs text-gray-600 mb-1">Submitted On</div>
                                    <div className="font-medium text-gray-900">
                                        {new Date(selectedApplication.appliedAt).toLocaleString("en-IN", {
                                            day: "2-digit",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        {selectedApplication.verificationStatus === "pending" && (
                            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
                                <button
                                    onClick={handleReject}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 bg-white border-2 border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-5 h-5" />
                                    {isProcessing ? "Processing..." : "Reject Application"}
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={isProcessing}
                                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    {isProcessing ? "Creating Account..." : "Approve & Create Account"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MLAApplications;
