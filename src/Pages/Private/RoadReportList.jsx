import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import useCity from "@/context/useCity";

const RoadReportList = () => {
  const { city } = useCity();

  const { data = [], isLoading } = useQuery({
    queryKey: ["road-reports", city],
    enabled: !!city,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        [Query.equal("district", city)]
      );
      return res.documents;
    },
  });

  if (isLoading) return <p>Loading road reports...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        Road Reports in {city} ({data.length})
      </h2>

      {data.map((r, i) => (
        <div key={r.$id} className="bg-white p-4 rounded-xl shadow">
          <p className="font-semibold">
            #{i + 1} {r.fromCity} → {r.toCity}
          </p>

          <p><strong>Condition:</strong> {r.condition}</p>
          <p><strong>Landmark:</strong> {r.landmark || "—"}</p>

          <div className="flex gap-3 mt-2">
            <button className="text-indigo-600 underline">
              View Map
            </button>

            <a
              href={`https://www.google.com/maps?q=${r.latitude},${r.longitude}`}
              target="_blank"
              className="text-green-600 underline"
            >
              Navigate
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadReportList;
