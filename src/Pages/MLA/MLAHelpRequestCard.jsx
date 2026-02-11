import { useState, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { AuthContext } from "@/context/AuthProvider";
import {
    MapPin,
    Users,
    Heart,
    Eye,
    MessageSquare,
    Navigation,
} from "lucide-react";
import { HELP_CATEGORIES_ARRAY } from "@/constants/helpRequestConstants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MLAResponseModal from "./MLAResponseModal";

const MLAHelpRequestCard = ({ request, onUpdate }) => {
    const { profile } = useContext(AuthContext);
    const queryClient = useQueryClient();
    const [imageError, setImageError] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);

    const categoryInfo = HELP_CATEGORIES_ARRAY.find(
        (cat) => cat.value === request.category
    );

    // Fetch MLA responses
    const { data: responses = [] } = useQuery({
        queryKey: ["mla-help-responses", request.$id],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_HELP_RESPONSES_COLLECTION_ID,
                [
                    Query.equal("helpRequestId", request.$id),
                    Query.orderDesc("$createdAt"),
                ]
            );
            return res.documents;
        },
    });

    const handleNavigate = () => {
        if (request.lat && request.lng) {
            window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${request.lat},${request.lng}`,
                "_blank"
            );
        }
    };

    // Status colors
    const statusColors = {
        PENDING: "bg-orange-500 text-white",
        ACKNOWLEDGED: "bg-cyan-500 text-white",
        IN_PROGRESS: "bg-orange-400 text-white",
        RESOLVED: "bg-emerald-500 text-white",
        REJECTED: "bg-rose-500 text-white",
    };

    // Priority colors
    const priorityColors = {
        CRITICAL: "border-rose-500",
        HIGH: "border-orange-500",
        MEDIUM: "border-yellow-500",
        LOW: "border-gray-300",
    };

    const latestResponse = responses[0]; // Most recent response

    return (
        <div
            className={`bg-white rounded-lg border-l-4 ${priorityColors[request.priority] || priorityColors.LOW
                } border-r border-t border-b border-gray-200 p-4 hover:shadow-md transition-all`}
        >
            {/* Header: Location & Status */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-emerald-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                        {request.village}, {request.mandal}
                    </span>
                </div>
                <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[request.status] || statusColors.PENDING
                        }`}
                >
                    {request.status}
                </span>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{categoryInfo?.icon || "⚠️"}</span>
                <span className="text-xs font-medium text-gray-500">
                    {categoryInfo?.label || request.category}
                </span>
                {request.priority && (
                    <span
                        className={`ml-auto px-2 py-0.5 rounded text-xs font-semibold ${request.priority === "CRITICAL"
                                ? "bg-rose-100 text-rose-700"
                                : request.priority === "HIGH"
                                    ? "bg-orange-100 text-orange-700"
                                    : request.priority === "MEDIUM"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {request.priority}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1">
                {request.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {request.description}
            </p>

            {/* Community Impact */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-900">
                        {request.affectedPopulation} people affected
                    </span>
                </div>
            </div>

            {/* Latest MLA Response Preview */}
            {latestResponse && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 mb-3">
                    <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-purple-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-purple-900 mb-0.5">
                                Your Response:
                            </p>
                            <p className="text-xs text-purple-700 line-clamp-2">
                                {latestResponse.message}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                                {new Date(latestResponse.$createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span className="font-semibold text-gray-700">
                            {request.likes || 0}
                        </span>
                    </div>

                    {responses.length > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            ✓ {responses.length} Response{responses.length > 1 ? "s" : ""}
                        </span>
                    )}
                </div>

                {/* Image thumbnail */}
                {request.mediaURL && !imageError && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors">
                                <Eye className="w-5 h-5" />
                                <span className="text-xs font-medium">View Image</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            {request.mediaType === "VIDEO" ? (
                                <video src={request.mediaURL} controls className="w-full" />
                            ) : (
                                <img
                                    src={request.mediaURL}
                                    alt="Issue"
                                    className="w-full"
                                    onError={() => setImageError(true)}
                                />
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Footer: Actions */}
            <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">
                        {request.reporterName}
                    </span>{" "}
                    • {new Date(request.$createdAt).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleNavigate}
                        className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors text-xs"
                    >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Navigate</span>
                    </button>
                    <button
                        onClick={() => setShowResponseModal(true)}
                        className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs font-semibold"
                    >
                        {responses.length > 0 ? "Update" : "Respond"}
                    </button>
                </div>
            </div>

            {/* Response Modal */}
            {showResponseModal && (
                <MLAResponseModal
                    request={request}
                    onClose={() => setShowResponseModal(false)}
                    onSuccess={() => {
                        setShowResponseModal(false);
                        onUpdate();
                        queryClient.invalidateQueries(["mla-help-responses", request.$id]);
                    }}
                />
            )}
        </div>
    );
};

export default MLAHelpRequestCard;
