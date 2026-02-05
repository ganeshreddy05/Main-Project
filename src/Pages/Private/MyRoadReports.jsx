import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import RoadReportCard from "@/Pages/Private/RoadReportsfile/RoadReportCard";

const MyRoadReports = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-road-reports", user?.$id],
    enabled: !!user,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        [Query.equal("userId", user.$id), Query.orderDesc("$createdAt")]
      );
      return res.documents;
    },
  });

  if (!user) return <p className="p-6">Please login to view your reports</p>;
  if (isLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">My Road Reports</h1>

      {data?.length ? (
        <div className="max-w-2xl space-y-4">
          {data.map((r) => (
            <RoadReportCard key={r.$id} report={r} showActions={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-2xl shadow">
          <p className="text-gray-500">No road reports yet</p>
        </div>
      )}
    </div>
  );
};

export default MyRoadReports;
