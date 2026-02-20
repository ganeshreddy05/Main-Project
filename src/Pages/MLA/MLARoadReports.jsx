import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { databases, ID } from "@/services/appwriteConfig";
import { Query } from "appwrite";
import { AuthContext } from "@/context/AuthProvider";
import { MapPin, Navigation, AlertCircle, Calendar, User, Image as ImageIcon, MessageSquare, X, Check, Briefcase } from "lucide-react";
import AssignToDepartmentModal from "@/components/AssignToDepartmentModal";
import { createWorkOrder } from "@/services/workOrderService";

const MLARoadReports = () => {
    const { profile, user } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [selectedReport, setSelectedReport] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [responseData, setResponseData] = useState({
        status: "",
        message: "",
        expectedDate: "",
    });

    // Fetch all road reports from MLA's district
    const { data: roadReports = [], isLoading } = useQuery({
        queryKey: ["mla-all-road-reports", profile?.district],
        queryFn: async () => {
            if (!profile?.district) return [];

            // Fetch all reports and filter client-side for case-insensitive matching
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );

            // Filter case-insensitively
            return res.documents.filter(
                doc => doc.district?.toLowerCase() === profile.district?.toLowerCase()
            );
        },
        enabled: !!profile?.district,
    });

    // Fetch MLA responses for these reports
    const { data: mlaResponses = [] } = useQuery({
        queryKey: ["mla-responses"],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_RESPONSES_COLLECTION_ID,
                [Query.orderDesc("$createdAt"), Query.limit(100)]
            );
            return res.documents;
        },
    });

    // Merge responses with reports
    const reportsWithResponses = roadReports.map(report => {
        const response = mlaResponses.find(r => r.roadReportId === report.$id);
        return { ...report, mlaResponse: response };
    });

    // Mutation to add MLA response
    const responseMutation = useMutation({
        mutationFn: async ({ reportId, data }) => {
            console.log("👤 Profile data:", profile);
            console.log("📋 Report ID:", reportId);

            // Prepare MLA response document for separate collection
            const responsePayload = {
                roadReportId: reportId,
                mlaId: user?.$id,
                mlaName: profile?.name || "Unknown MLA",
                mlaDistrict: profile?.district || "",
                responseMessage: data.message,
                responseStatus: data.status,
            };

            // Add expectedCompletionDate if provided
            if (data.expectedDate) {
                responsePayload.expectedCompletionDate = new Date(data.expectedDate).toISOString();
            }

            console.log("📤 Creating MLA response in separate collection:", responsePayload);

            // Create response document in mla_responses collection
            const response = await databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_RESPONSES_COLLECTION_ID,
                ID.unique(),
                responsePayload
            );

            console.log("✅ MLA Response created successfully:", response);
            return response;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["mla-all-road-reports"]);
            queryClient.invalidateQueries(["mla-road-reports"]);
            queryClient.invalidateQueries(["mla-responses"]); // Refresh responses
            setShowModal(false);
            setSelectedReport(null);
            setResponseData({ status: "", message: "", expectedDate: "" });
            alert("Response added successfully!");
        },
        onError: (error) => {
            console.error("❌ Full error details:", error);
            console.error("Error type:", error?.type);
            console.error("Error code:", error?.code);
            console.error("Error response:", error?.response);

            let errorMessage = "Unknown error occurred";

            if (error?.message) {
                errorMessage = error.message;
            }

            if (error?.response) {
                errorMessage += "\n\nResponse: " + JSON.stringify(error.response, null, 2);
            }

            alert("Error adding response: " + errorMessage + "\n\nCheck console for full details.");
        },
    });

    const handleOpenModal = (report) => {
        setSelectedReport(report);
        setShowModal(true);
        // Pre-fill if there's an existing response
        if (report.mlaResponse) {
            setResponseData({
                status: report.mlaResponse.responseStatus || "",
                message: report.mlaResponse.responseMessage || "",
                expectedDate: report.mlaResponse.expectedCompletionDate?.split('T')[0] || "",
            });
        }
    };

    const handleSubmitResponse = () => {
        if (!responseData.status || !responseData.message.trim()) {
            alert("Please select a status and provide a message");
            return;
        }

        responseMutation.mutate({
            reportId: selectedReport.$id,
            data: responseData,
        });
    };

    // Mutation to assign work to department
    const assignWorkMutation = useMutation({
        mutationFn: async ({ report, assignmentData }) => {
            console.log("🔍 Creating work order for report:", report.$id);
            console.log("📋 Assignment data:", assignmentData);

            // Generate unique work order ID
            const uniqueWorkOrderId = `WO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // 1. Create work order - Be explicit about fields to avoid unknown attributes
            const workOrderData = {
                workOrderId: uniqueWorkOrderId,
                roadReportId: report.$id,
                mlaId: user?.$id,
                mlaName: profile?.name || "Unknown MLA",
                mlaConstituency: profile?.district || "",
                assignedDepartment: assignmentData.department,
                priorityLevel: assignmentData.priority,
                status: "pending",
                mlaInstructions: assignmentData.instructions,
                assignedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            // Only add estimatedCompletionDate if provided
            if (assignmentData.estimatedDate) {
                workOrderData.estimatedCompletionDate = assignmentData.estimatedDate;
            }

            console.log("📤 Sending work order data:", workOrderData);

            const workOrder = await createWorkOrder(workOrderData);
            console.log("✅ Work order created successfully:", workOrder.$id);

            return workOrder;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["mla-all-road-reports"]);
            queryClient.invalidateQueries(["mla-road-reports"]);
            setShowAssignModal(false);
            setSelectedReport(null);
            alert("Work order assigned successfully! The department will be notified.");
        },
        onError: (error) => {
            console.error("Error assigning work order:", error);
            alert("Error assigning work order: " + error.message);
        },
    });

    const handleOpenAssignModal = (report) => {
        setSelectedReport(report);
        setShowAssignModal(true);
    };

    const handleAssignWork = (assignmentData) => {
        assignWorkMutation.mutate({
            report: selectedReport,
            assignmentData,
        });
    };


    const getConditionColor = (condition) => {
        switch (condition) {
            case "GOOD":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "BAD":
                return "bg-red-100 text-red-700 border-red-200";
            case "UNDER_CONSTRUCTION":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "ACCIDENT":
                return "bg-rose-100 text-rose-700 border-rose-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getStatusColor = (status) => {
        const upperStatus = status?.toUpperCase();
        switch (upperStatus) {
            case "RESOLVED":
                return "bg-emerald-100 text-emerald-700";
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700";
            case "ACTIVE":
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-emerald-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 -m-6 px-6 py-4 mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Road Reports</h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    All reports from {profile?.district}, {profile?.state}
                </p>
                <div className="mt-2 text-sm text-gray-500">
                    Total: <span className="font-semibold text-emerald-600">{roadReports.length}</span> reports
                </div>
            </div>

            {/* Reports Grid */}
            {roadReports.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No road reports from your constituency yet</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {roadReports.map((report) => (
                        <div
                            key={report.$id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200 group"
                        >
                            {/* Image Section */}
                            {report.mediaURL ? (
                                <div className="relative h-48 bg-gray-100 overflow-hidden">
                                    {report.mediaType === "VIDEO" ? (
                                        <video
                                            src={report.mediaURL}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            controls
                                        />
                                    ) : (
                                        <img
                                            src={report.mediaURL}
                                            alt={report.fromPlace}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    )}
                                    {/* Condition Badge on Image */}
                                    <div className="absolute top-3 right-3">
                                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border backdrop-blur-sm bg-white/90 ${getConditionColor(report.condition)}`}>
                                            {report.condition?.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <ImageIcon className="w-16 h-16 text-gray-400" />
                                </div>
                            )}

                            {/* Card Content */}
                            <div className="p-5 space-y-4">
                                {/* Route Section */}
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                            <Navigation className="w-4 h-4 text-emerald-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-gray-500">FROM</span>
                                            </div>
                                            <p className="font-semibold text-gray-900 truncate">
                                                {report.fromPlace}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 ml-11">
                                        <div className="w-0.5 h-6 bg-gray-300"></div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-teal-700" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-medium text-gray-500">TO</span>
                                            </div>
                                            <p className="font-semibold text-gray-900 truncate">
                                                {report.toPlace}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Landmark */}
                                {report.landmark && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="truncate">{report.landmark}</span>
                                    </div>
                                )}

                                {/* Description */}
                                {report.description && (
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {report.description}
                                    </p>
                                )}

                                {/* MLA Response Section */}
                                {report.mlaResponse && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-emerald-700" />
                                            <span className="text-xs font-semibold text-emerald-900">Your Response</span>
                                        </div>
                                        <p className="text-sm text-emerald-800 line-clamp-2">
                                            {report.mlaResponse.responseMessage}
                                        </p>
                                        {report.mlaResponse.expectedCompletionDate && (
                                            <div className="flex items-center gap-1 text-xs text-emerald-700">
                                                <Calendar className="w-3 h-3" />
                                                <span>Expected: {new Date(report.mlaResponse.expectedCompletionDate).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="border-t border-gray-100"></div>

                                {/* Footer Info */}
                                <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <User className="w-3.5 h-3.5" />
                                        <span>{report.reporterName || "Anonymous"}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500">
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>{new Date(report.$createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                                        {report.status || "Active"}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Add/Update Response Button */}
                                    <button
                                        onClick={() => handleOpenModal(report)}
                                        className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-sm">{report.mlaResponse ? "Update" : "Respond"}</span>
                                    </button>

                                    {/* Assign to Department Button */}
                                    <button
                                        onClick={() => handleOpenAssignModal(report)}
                                        className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-2.5 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-amber-600 shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
                                    >
                                        <Briefcase className="w-4 h-4" />
                                        <span className="text-sm">Assign</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Response Modal */}
            {showModal && selectedReport && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 sticky top-0 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">Add Your Response</h2>
                                    <p className="text-emerald-100 text-sm">
                                        {selectedReport.fromPlace} → {selectedReport.toPlace}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedReport(null);
                                        setResponseData({ status: "", message: "", expectedDate: "" });
                                    }}
                                    className="p-2 hover:bg-white/20 rounded-lg transition"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Response Status *
                                </label>
                                <select
                                    value={responseData.status}
                                    onChange={(e) => setResponseData({ ...responseData, status: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Acknowledged">✅ Acknowledged</option>
                                    <option value="In Progress">🔄 In Progress</option>
                                    <option value="Scheduled for Fix">📅 Scheduled for Fix</option>
                                    <option value="Completed">✅ Completed</option>
                                    <option value="Under Review">🔍 Under Review</option>
                                </select>
                            </div>

                            {/* Message Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Your Message *
                                </label>
                                <textarea
                                    value={responseData.message}
                                    onChange={(e) => setResponseData({ ...responseData, message: e.target.value })}
                                    placeholder="e.g., We will fix this road within 2 weeks. Our team has been assigned to assess and repair the potholes..."
                                    rows={5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    💡 Be specific about timeline, actions being taken, and who to contact
                                </p>
                            </div>

                            {/* Expected Completion Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 mb-2">
                                    Expected Completion Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={responseData.expectedDate}
                                    onChange={(e) => setResponseData({ ...responseData, expectedDate: e.target.value })}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>

                            {/* Preview */}
                            {responseData.message && (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                    <h4 className="text-sm font-semibold text-emerald-900 mb-2">Preview:</h4>
                                    <p className="text-sm text-emerald-800">{responseData.message}</p>
                                    {responseData.expectedDate && (
                                        <p className="text-xs text-emerald-700 mt-2">
                                            Expected: {new Date(responseData.expectedDate).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 p-6 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedReport(null);
                                    setResponseData({ status: "", message: "", expectedDate: "" });
                                }}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitResponse}
                                disabled={responseMutation.isPending}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {responseMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check className="w-4 h-4" />
                                        <span>Submit Response</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {showAssignModal && selectedReport && (
                <AssignToDepartmentModal
                    report={selectedReport}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedReport(null);
                    }}
                    onAssign={handleAssignWork}
                    isLoading={assignWorkMutation.isPending}
                />
            )}
        </div>
    );
};

export default MLARoadReports;
