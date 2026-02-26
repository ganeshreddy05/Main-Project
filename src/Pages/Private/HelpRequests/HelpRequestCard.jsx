import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MapPin, Navigation, Users, Eye, Trash2, CheckCircle } from "lucide-react";
import { HELP_CATEGORIES_ARRAY } from "@/constants/helpRequestConstants";

const HelpRequestCard = ({ request, showActions = false }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [imageError, setImageError] = useState(false);

    const categoryInfo = HELP_CATEGORIES_ARRAY.find(cat => cat.value === request.category);

    // Fetch MLA responses
    const { data: responses = [] } = useQuery({
        queryKey: ["mla-responses", request.$id],
        queryFn: async () => {
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_MLA_HELP_RESPONSES_COLLECTION_ID,
                [Query.equal("helpRequestId", request.$id), Query.orderDesc("$createdAt")]
            );
            return res.documents;
        },
    });

    const hasLiked = request.likedBy?.includes(user?.$id);
    const isOwner = request.userId === user?.$id;

    const handleNavigate = () => {
        if (request.lat && request.lng) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${request.lat},${request.lng}`, "_blank");
        }
    };

    // Like mutation
    const likeMutation = useMutation({
        mutationFn: async () => {
            let newLikedBy = [...(request.likedBy || [])];
            if (hasLiked) {
                newLikedBy = newLikedBy.filter((id) => id !== user.$id);
            } else {
                newLikedBy.push(user.$id);
            }
            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
                request.$id,
                { likedBy: newLikedBy, likes: newLikedBy.length }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["help-requests"]);
            queryClient.invalidateQueries(["my-help-requests"]);
            queryClient.invalidateQueries(["dashboard-help-requests"]);
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async () => {
            await databases.deleteDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
                request.$id
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["help-requests"]);
            queryClient.invalidateQueries(["my-help-requests"]);
            queryClient.invalidateQueries(["dashboard-help-requests"]);
            alert("✅ Help request deleted successfully.");
        },
        onError: (error) => {
            console.error("Delete failed:", error);
            alert("❌ Failed to delete: " + (error?.message || "Permission denied. You may not have delete access to this document."));
        },
    });

    const resolveMutation = useMutation({
        mutationFn: async () => {
            await databases.updateDocument(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
                request.$id,
                { status: "RESOLVED" }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["help-requests"]);
            queryClient.invalidateQueries(["my-help-requests"]);
            queryClient.invalidateQueries(["dashboard-help-requests"]);
        },
    });

    // Status colors - minimal palette
    const statusColors = {
        PENDING: "bg-orange-500 text-white",
        ACKNOWLEDGED: "bg-cyan-500 text-white",
        IN_PROGRESS: "bg-orange-400 text-white",
        RESOLVED: "bg-emerald-500 text-white",
        REJECTED: "bg-rose-500 text-white"
    };

    return (
        <div className="bg-white rounded-lg border-l-4 border-l-emerald-500 border-r border-t border-b border-gray-200 p-4 hover:shadow-md transition-all hover:border-l-emerald-600">
            {/* Location */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-emerald-700">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-semibold">{request.village}, {request.mandal}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusColors[request.status] || statusColors.PENDING}`}>
                    {request.status}
                </span>
            </div>

            {/* Category Icon + Name */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{categoryInfo?.icon || "⚠️"}</span>
                <span className="text-xs font-medium text-gray-500">{categoryInfo?.label || request.category}</span>
            </div>

            {/* Title */}
            <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1">
                {request.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                {request.description}
            </p>

            {/* Affected Count - with color */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 mb-3">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-900">{request.affectedPopulation} people affected</span>
                </div>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => likeMutation.mutate()}
                        disabled={likeMutation.isPending}
                        className="flex items-center gap-1 hover:text-rose-500 transition-colors"
                    >
                        <Heart className={`w-4 h-4 ${hasLiked ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
                        <span className="font-semibold text-gray-700">{request.likes || 0}</span>
                    </button>

                    {/* MLA Response indicator */}
                    {responses.length > 0 && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            ✓ {responses.length} Response{responses.length > 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Image thumbnail */}
                {request.mediaURL && !imageError && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors group">
                                <Eye className="w-5 h-5" />
                                <span className="text-xs font-medium">View Image</span>
                            </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                            {request.mediaType === "VIDEO" ? (
                                <video src={request.mediaURL} controls className="w-full" />
                            ) : (
                                <img src={request.mediaURL} alt="Issue" className="w-full" />
                            )}
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {/* Footer */}
            <div className="mt-3 text-xs space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                        <span className="font-medium text-gray-700">{request.reporterName}</span> • {new Date(request.$createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleNavigate}
                            className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                        >
                            <Navigation className="w-3.5 h-3.5" />
                            <span>Navigate</span>
                        </button>
                        <button
                            onClick={() => window.location.href = `/dashboard/help-requests/${request.$id}`}
                            className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                        >
                            View Details
                        </button>
                    </div>
                </div>

                {/* Delete & Resolve buttons (only for owner in My History) */}
                {showActions && isOwner && (
                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                        {request.status !== "RESOLVED" && (
                            <button
                                onClick={() => {
                                    if (window.confirm("Mark this request as resolved?")) {
                                        resolveMutation.mutate();
                                    }
                                }}
                                disabled={resolveMutation.isPending}
                                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-xs font-semibold"
                            >
                                <CheckCircle className="w-3.5 h-3.5" />
                                {resolveMutation.isPending ? "..." : "Resolve"}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this help request? This action cannot be undone.")) {
                                    deleteMutation.mutate();
                                }
                            }}
                            disabled={deleteMutation.isPending}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-xs font-semibold"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpRequestCard;
