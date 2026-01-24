import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import useCity from "@/context/useCity";
import RoadReportCard from "./RoadReportCard";

const RoadReportList = () => {
  const { district } = useCity();

  console.log("District:", district);

  const { data = [], isLoading } = useQuery({
    queryKey: ["road-reports", district],
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        district
          ? [
              Query.equal("district", district),
              console.log("user District ,district"),
              Query.equal("status", "ACTIVE"),
            ]
          : []
      );
      return res.documents;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Road Reports ({data.length})</h2>

      {data.length === 0 && <p>No reports found</p>}

      {data.map((r) => (
        <RoadReportCard key={r.$id} report={r} />
      ))}
    </div>
  );
};

export default RoadReportList;
