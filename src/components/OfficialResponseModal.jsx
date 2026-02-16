import { useState } from "react";
import {
    X,
    Calendar,
    FileText,
    AlertCircle,
    CheckCircle,
    Clock,
    User
} from "lucide-react";

const OfficialResponseModal = ({ workOrder, onClose, onSubmit, isLoading }) => {
    const [responseData, setResponseData] = useState({
        status: workOrder.status || "pending",
        officialNotes: "",
        estimatedDays: "",
        issuesFaced: "",
        resourcesNeeded: "",
        actualCompletionDate: "",
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!responseData.status) {
            newErrors.status = "Please select a status";
        }

        if (responseData.status === "rejected" && !responseData.issuesFaced) {
            newErrors.issuesFaced = "Please provide reason for rejection";
        }

        if (responseData.status === "completed" && !responseData.actualCompletionDate) {
            newErrors.actualCompletionDate = "Please provide completion date";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        onSubmit(responseData);
    };

    const statusOptions = [
        { value: "pending", label: "Pending Review", color: "yellow", disabled: false },
        { value: "accepted", label: "Accepted", color: "blue", disabled: false },
        { value: "in_progress", label: "In Progress", color: "purple", disabled: false },
        { value: "completed", label: "Completed", color: "green", disabled: false },
        { value: "rejected", label: "Rejected", color: "red", disabled: false },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Update Work Order</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            Work Order: {workOrder.workOrderId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* MLA Instructions (Read-only) */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            MLA Instructions
                        </h3>
                        <p className="text-sm text-purple-800">
                            {workOrder.mlaInstructions}
                        </p>
                        <div className="mt-2 text-xs text-purple-700">
                            From: {workOrder.mlaName} • Priority: {workOrder.priorityLevel?.toUpperCase()}
                        </div>
                    </div>

                    {/* Status Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={responseData.status}
                            onChange={(e) => setResponseData({ ...responseData, status: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value} disabled={option.disabled}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                {errors.status}
                            </p>
                        )}
                    </div>

                    {/* Official Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Progress Notes / Updates
                        </label>
                        <textarea
                            value={responseData.officialNotes}
                            onChange={(e) => setResponseData({ ...responseData, officialNotes: e.target.value })}
                            placeholder="Provide updates on the work progress, actions taken, or current status..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                        />
                    </div>

                    {/* Estimated Days (for accepted/in_progress) */}
                    {(responseData.status === "accepted" || responseData.status === "in_progress") && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estimated Days to Complete
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={responseData.estimatedDays}
                                    onChange={(e) => setResponseData({ ...responseData, estimatedDays: e.target.value })}
                                    placeholder="e.g., 7"
                                    min="1"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">How many days will it take to complete this work?</p>
                        </div>
                    )}

                    {/* Issues Faced (for rejected or in_progress) */}
                    {(responseData.status === "rejected" || responseData.status === "in_progress") && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {responseData.status === "rejected" ? "Reason for Rejection" : "Issues / Challenges Faced"}
                                {responseData.status === "rejected" && <span className="text-red-500"> *</span>}
                            </label>
                            <textarea
                                value={responseData.issuesFaced}
                                onChange={(e) => setResponseData({ ...responseData, issuesFaced: e.target.value })}
                                placeholder={responseData.status === "rejected"
                                    ? "Explain why this work order cannot be completed..."
                                    : "Describe any challenges or obstacles encountered..."}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                            />
                            {errors.issuesFaced && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.issuesFaced}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Resources Needed (for accepted/in_progress) */}
                    {(responseData.status === "accepted" || responseData.status === "in_progress") && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resources / Support Needed
                            </label>
                            <textarea
                                value={responseData.resourcesNeeded}
                                onChange={(e) => setResponseData({ ...responseData, resourcesNeeded: e.target.value })}
                                placeholder="List any resources, equipment, or support needed to complete this work..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
                            />
                        </div>
                    )}

                    {/* Actual Completion Date (for completed) */}
                    {responseData.status === "completed" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Actual Completion Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={responseData.actualCompletionDate}
                                    onChange={(e) => setResponseData({ ...responseData, actualCompletionDate: e.target.value })}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                                />
                            </div>
                            {errors.actualCompletionDate && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    {errors.actualCompletionDate}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Submit Update
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfficialResponseModal;
