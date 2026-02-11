import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Heart, MapPin, Navigation, Eye } from "lucide-react";

const RoadReportCard = ({ report, showActions = false }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Fetch MLA response
  const { data: mlaResponse } = useQuery({
    queryKey: ["mla-response", report.$id],
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_MLA_RESPONSES_COLLECTION_ID,
        [Query.equal("roadReportId", report.$id), Query.orderDesc("$createdAt"), Query.limit(1)]
      );
      return res.documents[0] || null;
    },
  });

  // Condition colors - minimal with accents
  const conditionColors = {
    GOOD: { bg: "bg-emerald-500", border: "border-l-emerald-500", text: "text-white" },
    BAD: { bg: "bg-rose-500", border: "border-l-rose-500", text: "text-white" },
    UNDER_CONSTRUCTION: { bg: "bg-orange-400", border: "border-l-orange-400", text: "text-white" },
    ACCIDENT: { bg: "bg-red-600", border: "border-l-red-600", text: "text-white" },
  };

  const conditionLabels = {
    GOOD: "Good",
    BAD: "Bad",
    UNDER_CONSTRUCTION: "Under Construction",
    ACCIDENT: "Accident",
  };

  const conditionStyle = conditionColors[report.condition] || { bg: "bg-gray-500", border: "border-l-gray-500", text: "text-white" };

  const handleNavigate = () => {
    if (report.lat && report.lng) {
      window.open(`https://www.google.com/maps?q=${report.lat},${report.lng}`, "_blank");
    }
  };

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const currentLikes = report.likes || 0;
      const newLikes = isLiked ? currentLikes - 1 : currentLikes + 1;
      const result = await databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        report.$id,
        { likes: newLikes < 0 ? 0 : newLikes }
      );
      setIsLiked(!isLiked);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
    },
  });

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
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return databases.deleteDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        report.$id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["dashboard-road-reports"]);
      queryClient.invalidateQueries(["my-road-reports"]);
    },
  });

  return (
    <div className={`bg-white rounded-lg border-l-4 ${conditionStyle.border} border-r border-t border-b border-gray-200 p-4 hover:shadow-md transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-gray-700">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-sm font-semibold">{report.fromPlace} → {report.toPlace}</span>
        </div>
        <span className={`${conditionStyle.bg} ${conditionStyle.text} px-2.5 py-0.5 rounded-full text-xs font-semibold`}>
          {conditionLabels[report.condition] || report.condition}
        </span>
      </div>

      {/* Reporter */}
      <p className="text-xs text-gray-500 mb-2">
        By <span className="font-semibold text-gray-700">{report.reporterName}</span>
      </p>

      {/* Description */}
      {report.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
          {report.description}
        </p>
      )}

      {/* Landmark */}
      {report.landmark && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 mb-3">
          <p className="text-xs text-amber-900 font-medium">📍 {report.landmark}</p>
        </div>
      )}

      {/* MLA Response */}
      {mlaResponse && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 mb-3">
          <p className="text-xs text-emerald-800 font-bold mb-1">✅ MLA Response</p>
          <p className="text-xs text-emerald-700 leading-relaxed">{mlaResponse.responseMessage}</p>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            className="flex items-center gap-1 hover:text-rose-500 transition-colors"
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />
            <span className="font-semibold text-gray-700">{report.likes || 0}</span>
          </button>

          {/* Image icon */}
          {report.mediaURL && (
            <Dialog open={isImageOpen} onOpenChange={setIsImageOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors">
                  <Eye className="w-5 h-5" />
                  <span className="text-xs font-medium">View Image</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">
                <img src={report.mediaURL} alt="Road" className="w-full" />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <button
          onClick={handleNavigate}
          className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Navigate</span>
        </button>
      </div>

      {/* Owner actions */}
      {showActions && user?.$id === report.userId && report.status === "ACTIVE" && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => { if (window.confirm("Mark as resolved?")) resolveMutation.mutate(); }}
            disabled={resolveMutation.isPending}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            ✓ Resolve
          </button>
          <button
            onClick={() => { if (window.confirm("Delete this report?")) deleteMutation.mutate(); }}
            disabled={deleteMutation.isPending}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-1.5 rounded-lg text-xs font-semibold transition-colors"
          >
            🗑 Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default RoadReportCard;
