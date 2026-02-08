import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MapPin, Navigation, MessageSquare, Calendar } from "lucide-react";

const RoadReportCard = ({ report, showActions = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isImageOpen, setIsImageOpen] = useState(false);

  // Track liked state locally (since we're not using likedBy array anymore)
  const [isLiked, setIsLiked] = useState(false);

  // Fetch MLA response for this report
  const { data: mlaResponse } = useQuery({
    queryKey: ["mla-response", report.$id],
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_MLA_RESPONSES_COLLECTION_ID,
        [
          Query.equal("roadReportId", report.$id),
          Query.orderDesc("$createdAt"),
          Query.limit(1)
        ]
      );
      return res.documents[0] || null;
    },
  });

  // Condition badge colors - more vibrant
  const conditionStyles = {
    GOOD: { bg: "bg-emerald-500", text: "Good" },
    BAD: { bg: "bg-rose-600", text: "Bad" },
    UNDER_CONSTRUCTION: { bg: "bg-amber-500", text: "Under Construction" },
    ACCIDENT: { bg: "bg-orange-600", text: "Accident" },
  };

  // Status badge colors
  const statusStyles = {
    ACTIVE: { bg: "bg-cyan-500", text: "Active" },
    RESOLVED: { bg: "bg-slate-500", text: "Resolved" },
  };

  const conditionStyle = conditionStyles[report.condition] || { bg: "bg-gray-500", text: report.condition };
  const statusStyle = statusStyles[report.status] || { bg: "bg-gray-400", text: report.status };

  // Navigate to location using Google Maps
  const handleNavigate = () => {
    if (report.lat && report.lng) {
      const url = `https://www.google.com/maps?q=${report.lat},${report.lng}`;
      window.open(url, "_blank");
    } else {
      alert("Location coordinates not available");
    }
  };

  // Like/Unlike mutation - FIXED with better logging
  const likeMutation = useMutation({
    mutationFn: async () => {
      console.log("=== LIKE MUTATION STARTED ===");
      console.log("User:", user);
      console.log("Report ID:", report.$id);
      console.log("Current likes:", report.likes);
      console.log("Is liked (local state):", isLiked);

      if (!user) {
        throw new Error("Please login to like reports");
      }

      // Calculate new like count
      const currentLikes = report.likes || 0;
      const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

      console.log("New likes to set:", newLikes);

      try {
        // Update only the likes count - simpler approach
        const result = await databases.updateDocument(
          import.meta.env.VITE_DATABASE_ID,
          import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
          report.$id,
          {
            likes: newLikes < 0 ? 0 : newLikes, // Prevent negative likes
          }
        );
        console.log("Update successful:", result);
        setIsLiked(!isLiked); // Toggle local state
        return result;
      } catch (error) {
        console.error("Update failed with error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("=== LIKE MUTATION SUCCESS ===", data);
      // Invalidate all queries to refresh the data
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
    },
    onError: (error) => {
      console.error("=== LIKE MUTATION ERROR ===");
      console.error("Error details:", error);
      console.error("Error message:", error.message);
      console.error("Error type:", error.type);

      // Show user-friendly error
      alert(`Failed to update like: ${error.message || "Please check permissions in Appwrite"}`);
    },
  });

  // Mark as Resolved mutation
  const resolveMutation = useMutation({
    mutationFn: async () => {
      return databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        report.$id,
        { status: "RESOLVED" }
      );
    },
    onSuccess: () => {
      alert("Report marked as resolved ✅");
      // Invalidate all related queries to update everywhere
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
    },
    onError: (error) => {
      console.error("Resolve error:", error);
      alert("Failed to mark as resolved. Please try again.");
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      return databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        report.$id
      );
    },
    onSuccess: () => {
      alert("Report deleted successfully ✅");
      // Invalidate all related queries to update everywhere
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
    },
    onError: (error) => {
      console.error("Delete error:", error);
      alert("Failed to delete report. Please try again.");
    },
  });

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report? This action cannot be undone."
    );
    if (confirmed) {
      deleteMutation.mutate();
    }
  };

  const handleResolve = () => {
    const confirmed = window.confirm(
      "Mark this report as resolved? This will update the status."
    );
    if (confirmed) {
      resolveMutation.mutate();
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-900 leading-tight">
              {report.fromPlace} → {report.toPlace}
            </h3>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin size={10} className="text-indigo-500" />
              {report.district}
            </p>
          </div>

          {/* Status Badge */}
          <span className={`${statusStyle.bg} text-white px-2 py-0.5 rounded-full text-xs font-medium`}>
            {statusStyle.text}
          </span>
        </div>

        {/* Condition Badge */}
        <span className={`${conditionStyle.bg} text-white px-2.5 py-1 rounded-full text-xs font-semibold inline-block shadow-sm`}>
          {conditionStyle.text}
        </span>
      </div>

      {/* Image - Direct Click */}
      {report.mediaURL && (
        <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
          <DialogTrigger asChild>
            <div className="cursor-pointer hover:opacity-95 transition">
              <img
                src={report.mediaURL}
                alt="road condition"
                className="w-full h-40 object-cover"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] p-0">
            <img
              src={report.mediaURL}
              alt="road condition full view"
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Landmark */}
        {report.landmark && (
          <p className="text-xs text-gray-600 bg-yellow-50 px-2 py-1 rounded border-l-2 border-yellow-400">
            📍 {report.landmark}
          </p>
        )}

        {/* Description if available */}
        {report.description && (
          <div className="text-xs text-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
            <p className="font-bold text-blue-800 mb-1">📝 Details:</p>
            <p className="leading-relaxed text-gray-800">{report.description}</p>
          </div>
        )}

        {/* MLA Response Section */}
        {mlaResponse && (
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-3 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-900">MLA Response</span>
              <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-200 text-emerald-800">
                {mlaResponse.responseStatus}
              </span>
            </div>
            <div className="bg-white/60 rounded px-2 py-2">
              <p className="text-xs text-emerald-900 font-medium">
                {mlaResponse.responseMessage}
              </p>
            </div>
            {mlaResponse.expectedCompletionDate && (
              <div className="flex items-center gap-1 text-xs text-emerald-700">
                <Calendar className="w-3 h-3" />
                <span className="font-medium">Expected: {new Date(mlaResponse.expectedCompletionDate).toLocaleDateString()}</span>
              </div>
            )}
            <div className="text-xs text-emerald-600">
              <span className="font-semibold">{mlaResponse.mlaName}</span> • {mlaResponse.mlaDistrict}
            </div>
          </div>
        )}


        {/* Actions Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Reporter */}
          <div className="text-xs text-gray-500 flex-1 min-w-0">
            <span className="truncate block">by <strong className="text-gray-700">{report.reporterName}</strong></span>
          </div>

          {/* Like Button */}
          <button
            onClick={() => likeMutation.mutate()}
            disabled={!user || likeMutation.isPending}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition transform hover:scale-105 ${isLiked
              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}
            title={!user ? "Login to like" : isLiked ? "Unlike" : "Like"}
          >
            <Heart size={14} className={isLiked ? "fill-current" : ""} />
            <span className="font-bold text-xs">{report.likes || 0}</span>
          </button>
        </div>

        {/* Navigate Button */}
        <button
          onClick={handleNavigate}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm hover:shadow-md"
        >
          <Navigation size={14} />
          Navigate to Location
        </button>
      </div>

      {/* Owner Actions */}
      {showActions && user?.$id === report.userId && (
        <div className="p-2 bg-gray-50 border-t flex gap-2">
          {report.status === "ACTIVE" && (
            <button
              onClick={handleResolve}
              disabled={resolveMutation.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-1.5 rounded text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resolveMutation.isPending ? "Resolving..." : "✓ Mark Resolved"}
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex-1 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white py-1.5 rounded text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? "Deleting..." : "🗑 Delete"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RoadReportCard;
