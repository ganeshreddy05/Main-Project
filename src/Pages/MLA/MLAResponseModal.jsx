import { useState, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { databases, ID } from "@/services/appwriteConfig";
import { AuthContext } from "@/context/AuthProvider";
import { X, Send, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const MLAResponseModal = ({ request, onClose, onSuccess }) => {
    const { user, profile } = useContext(AuthContext);
    const [responseData, setResponseData] = useState({
        responseType: request.status === "PENDING" ? "ACKNOWLEDGED" : request.status,
        message: "",
        actionTaken: "",
        estimatedDays: "",
        followUpRequired: false,
        followUpNotes: "",
    });

    // Create MLA Response
    const responseMutation = useMutation({
        mutationFn: async (data) => {
            // Create the response document
            await databases.createDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_HELP_RESPONSES_COLLECTION_ID,
                ID.unique(),
                {
                    helpRequestId: request.$id,
                    mlaId: user.$id,
                    mlaName: profile.name,
                    mlaConstituency: profile.district,
                    ...data,
                    respondedAt: new Date().toISOString(),
                }
            );

            // Update the request status
            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
                request.$id,
                {
                    status: data.responseType,
                    lastUpdatedAt: new Date().toISOString(),
                }
            );
        },
        onSuccess: () => {
            toast.success("Response submitted successfully!");
            onSuccess();
        },
        onError: (error) => {
            toast.error("Failed to submit response: " + error.message);
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!responseData.message.trim()) {
            toast.error("Please enter a response message");
            return;
        }

        if (!responseData.actionTaken.trim()) {
            toast.error("Please describe the action taken");
            return;
        }

        responseMutation.mutate(responseData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Respond to Help Request
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">{request.title}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Request Summary */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2">Request Details</h3>
                        <div className="space-y-1 text-sm">
                            <p>
                                <span className="text-gray-600">Location:</span>{" "}
                                <span className="font-medium">
                                    {request.village}, {request.mandal}
                                </span>
                            </p>
                            <p>
                                <span className="text-gray-600">Affected:</span>{" "}
                                <span className="font-medium">
                                    {request.affectedPopulation} people
                                </span>
                            </p>
                            <p>
                                <span className="text-gray-600">Current Status:</span>{" "}
                                <span className="font-medium">{request.status}</span>
                            </p>
                        </div>
                    </div>

                    {/* Response Type / New Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Update Status <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={responseData.responseType}
                            onChange={(e) =>
                                setResponseData({
                                    ...responseData,
                                    responseType: e.target.value,
                                })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        >
                            <option value="ACKNOWLEDGED">Acknowledged</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            This will update the request status
                        </p>
                    </div>

                    {/* Response Message */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Response Message <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={responseData.message}
                            onChange={(e) =>
                                setResponseData({
                                    ...responseData,
                                    message: e.target.value,
                                })
                            }
                            rows={4}
                            placeholder="Write your response to the citizen. Explain what you will do or have done about this issue..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This message will be visible to the citizen who reported the issue
                        </p>
                    </div>

                    {/* Action Taken */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Action Taken <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            value={responseData.actionTaken}
                            onChange={(e) =>
                                setResponseData({
                                    ...responseData,
                                    actionTaken: e.target.value,
                                })
                            }
                            rows={3}
                            placeholder="Describe what specific actions you have taken or plan to take (e.g., 'Contacted PWD department', 'Team will visit site tomorrow')"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    {/* Estimated Days (Optional) */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Estimated Resolution Time (Days)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={responseData.estimatedDays}
                            onChange={(e) =>
                                setResponseData({
                                    ...responseData,
                                    estimatedDays: e.target.value,
                                })
                            }
                            placeholder="e.g., 7"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Expected number of days to resolve this issue (optional)
                        </p>
                    </div>

                    {/* Follow-up Required */}
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="followUpRequired"
                            checked={responseData.followUpRequired}
                            onChange={(e) =>
                                setResponseData({
                                    ...responseData,
                                    followUpRequired: e.target.checked,
                                })
                            }
                            className="mt-1 w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="followUpRequired" className="flex-1">
                            <span className="block text-sm font-semibold text-gray-700">
                                Follow-up Required
                            </span>
                            <span className="text-xs text-gray-500">
                                Check this if you plan to follow up on this issue
                            </span>
                        </label>
                    </div>

                    {/* Follow-up Notes (conditional) */}
                    {responseData.followUpRequired && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Follow-up Notes
                            </label>
                            <textarea
                                value={responseData.followUpNotes}
                                onChange={(e) =>
                                    setResponseData({
                                        ...responseData,
                                        followUpNotes: e.target.value,
                                    })
                                }
                                rows={2}
                                placeholder="Add notes about follow-up actions (e.g., 'Will visit the site on Feb 15')"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            />
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            disabled={responseMutation.isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={responseMutation.isPending}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {responseMutation.isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Submit Response</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MLAResponseModal;
