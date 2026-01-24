import { useMutation, useQueryClient } from "@tanstack/react-query";
import  resolveRoadReport  from "@/services/roadReportService";
import { useAuth } from "@/context/useAuth";
import { Button } from "@/components/ui/button";

const RoadReportCard = ({ report }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isOwner = report.userId === user.$id;
  const isResolved = report.status === "RESOLVED";

  const resolveMutation = useMutation({
    mutationFn: () => resolveRoadReport(report.$id),
    onSuccess: () => {
      queryClient.invalidateQueries(["road-reports"]);
      queryClient.invalidateQueries(["my-history"]);
    },
  });

  return (
    <div className="bg-white rounded-2xl p-4 shadow space-y-2">
      <h3 className="font-semibold text-lg">
        {report.fromPlace} → {report.toPlace}
      </h3>

      <p className="text-sm text-gray-600">
        📍 {report.district}, {report.state}
      </p>

      <p><strong>Condition:</strong> {report.condition}</p>

      {report.landmark && (
        <p><strong>Landmark:</strong> {report.landmark}</p>
      )}

      <p>
        <strong>Status:</strong>{" "}
        <span className={isResolved ? "text-green-600" : "text-orange-600"}>
          {report.status}
        </span>
      </p>

      {/* Media */}
      {report.mediaURL && report.mediaType === "IMAGE" && (
        <img src={report.mediaURL} className="rounded-xl mt-2" />
      )}

      {report.mediaURL && report.mediaType === "VIDEO" && (
        <video src={report.mediaURL} controls className="rounded-xl mt-2" />
      )}

      {/* Resolve – OWNER ONLY */}
      {isOwner && !isResolved && (
        <Button
          className="mt-3 bg-green-600"
          onClick={() => resolveMutation.mutate()}
          disabled={resolveMutation.isPending}
        >
          {resolveMutation.isPending ? "Resolving..." : "Mark as Resolved"}
        </Button>
      )}
    </div>
  );
};

export default RoadReportCard;
