import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import RoadReportCard from "./RoadReportCard";

const RoadReportList = ({ district }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["roadReports", district],
    enabled: !!district,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        [Query.equal("district", district)]
      );
      return res.documents;
    },
  });

  if (!district) return <p>Select district</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
      {data.map((r) => (
        <RoadReportCard key={r.$id} report={r} />
      ))}
    </div>
  );
};

export default RoadReportList;
