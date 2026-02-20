import { useState } from "react";
import { X, Briefcase, Flag, Calendar, FileText, AlertCircle } from "lucide-react";
import { DEPARTMENTS_ARRAY } from "@/constants/departmentConstants";

const AssignToDepartmentModal = ({ report, onClose, onAssign, isLoading }) => {
    const [formData, setFormData] = useState({
        department: "",
        priority: "medium",
        instructions: "",
        estimatedDate: "",
    });

    const [errors, setErrors] = useState({});

    const priorityOptions = [
        { value: "low", label: "Low", color: "bg-gray-100 text-gray-700", icon: "🔵" },
        { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700", icon: "🟡" },
        { value: "high", label: "High", color: "bg-orange-100 text-orange-700", icon: "🟠" },
        { value: "urgent", label: "Urgent", color: "bg-red-100 text-red-700", icon: "🔴" },
        { value: "critical", label: "Critical", color: "bg-rose-100 text-rose-700", icon: "🚨" },
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.department) {
            newErrors.department = "Please select a department";
        }

        if (!formData.instructions.trim()) {
            newErrors.instructions = "Please provide instructions";
        } else if (formData.instructions.trim().length < 20) {
            newErrors.instructions = "Instructions must be at least 20 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onAssign(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-500 text-white p-6 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Assign to Department</h2>
                            <p className="text-red-100 text-sm">
                                Create a work order for department officials
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Original Report Info */}
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-red-900 mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Original Report
                        </h3>
                        <div className="space-y-1 text-sm text-red-800">
                            {/* Road Report fields */}
                            {report.fromPlace && (
                                <p>
                                    <span className="font-medium">Route:</span> {report.fromPlace} → {report.toPlace}
                                </p>
                            )}
                            {report.condition && (
                                <p>
                                    <span className="font-medium">Condition:</span>{" "}
                                    {report.condition?.replace(/_/g, " ")}
                                </p>
                            )}
                            {/* Help Request fields */}
                            {report.title && (
                                <p>
                                    <span className="font-medium">Title:</span> {report.title}
                                </p>
                            )}
                            {report.category && !report.fromPlace && (
                                <p>
                                    <span className="font-medium">Category:</span> {report.category?.replace(/_/g, " ")}
                                </p>
                            )}
                            {report.priority && !report.fromPlace && (
                                <p>
                                    <span className="font-medium">Priority:</span> {report.priority}
                                </p>
                            )}
                            {report.village && (
                                <p>
                                    <span className="font-medium">Location:</span> {report.village}, {report.mandal}
                                </p>
                            )}
                            <p>
                                <span className="font-medium">Reported:</span>{" "}
                                {new Date(report.$createdAt).toLocaleDateString()}
                            </p>
                            {report.description && (
                                <p className="mt-2">
                                    <span className="font-medium">Description:</span> {report.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Department Selection */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Select Department <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <select
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className={`w-full pl-11 pr-4 py-3 border ${errors.department ? "border-red-300" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white`}
                            >
                                <option value="">Choose a department...</option>
                                {DEPARTMENTS_ARRAY.map((dept) => (
                                    <option key={dept.value} value={dept.value}>
                                        {dept.icon} {dept.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errors.department && (
                            <p className="text-red-500 text-xs mt-1">{errors.department}</p>
                        )}
                    </div>

                    {/* Priority Level */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Priority Level <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {priorityOptions.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority: option.value })}
                                    className={`p-3 rounded-lg border-2 transition-all ${formData.priority === option.value
                                        ? `${option.color} border-current`
                                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-xl mb-1">{option.icon}</div>
                                        <div className="text-xs font-medium">{option.label}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Expected Completion Date */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Expected Completion Date (Optional)
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="date"
                                value={formData.estimatedDate}
                                onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            💡 When do you expect this work to be completed?
                        </p>
                    </div>

                    {/* Instructions */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                            Instructions to Department <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                            <textarea
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                placeholder="Provide detailed instructions for the department official...

Example: Please inspect the potholes on this road and arrange for immediate repairs. This is a frequently used route and poses safety risks to commuters."
                                rows={6}
                                className={`w-full pl-11 pr-4 py-3 border ${errors.instructions ? "border-red-300" : "border-gray-300"
                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none`}
                            />
                        </div>
                        {errors.instructions && (
                            <p className="text-red-500 text-xs mt-1">{errors.instructions}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            💡 Be specific about the issue, urgency, and expected outcomes
                        </p>
                    </div>

                    {/* Preview */}
                    {formData.department && formData.instructions && (
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-red-900 mb-3 flex items-center gap-2">
                                <Flag className="w-4 h-4" />
                                Work Order Preview
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-medium">Department:</span>
                                    <span className="text-red-900">
                                        {DEPARTMENTS_ARRAY.find((d) => d.value === formData.department)?.label}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-red-600 font-medium">Priority:</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityOptions.find((p) => p.value === formData.priority)?.color
                                        }`}>
                                        {formData.priority.toUpperCase()}
                                    </span>
                                </div>
                                {formData.estimatedDate && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-red-600 font-medium">Due Date:</span>
                                        <span className="text-red-900">
                                            {new Date(formData.estimatedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6 flex gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-lg font-medium hover:from-yellow-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Creating Work Order...</span>
                            </>
                        ) : (
                            <>
                                <Briefcase className="w-4 h-4" />
                                <span>Assign Work Order</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignToDepartmentModal;
