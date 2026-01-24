import { useMutation, useQueryClient } from "@tanstack/react-query";
import { databases } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";

const RoadReportCard = ({ report }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: async () => {
      const updatedLikes = report.likes + 1;
      const updatedLikedBy = [...report.likedBy, user.$id];

      return databases.updateDocument(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        report.$id,
        {
          likes: updatedLikes,
          likedBy: updatedLikedBy,
        }
      );
    },
    onSuccess: () => queryClient.invalidateQueries(["road-reports"]),
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
    onSuccess: () => queryClient.invalidateQueries(["road-reports"]),
  });

  return (
    <div className="border p-4 rounded-lg shadow">
      <p><b>{report.fromPlace}</b> → <b>{report.toPlace}</b></p>
      <p>Condition: {report.condition}</p>
      <p>Landmark: {report.landmark}</p>
      <p>District: {report.district}</p>
      <p>City: {report.city}</p>

      {report.mediaURL && (
        <img src={report.mediaURL} alt="road" className="w-full h-40 object-cover mt-2 rounded" />
      )}

      <div className="flex justify-between mt-3">
        <button
          onClick={() => likeMutation.mutate()}
          disabled={report.likedBy.includes(user.$id)}
          className="text-blue-600"
        >
          👍 {report.likes}
        </button>

        {user.$id === report.userId && report.status === "ACTIVE" && (
          <button
            onClick={() => resolveMutation.mutate()}
            className="text-green-600"
          >
            Mark Resolved
          </button>
        )}
      </div>
    </div>
  );
};

export default RoadReportCard;
