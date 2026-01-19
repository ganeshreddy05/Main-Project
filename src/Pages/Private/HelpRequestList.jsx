import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import useCity from "@/context/useCity";
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HelpRequestList = () => {
  const { city } = useCity();
  const { user } = useAuth();

  const {
    data = [], 
    isLoading,
  } = useQuery({
    queryKey: ["help-requests", city],
    enabled: !!city && !!user,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        [
          Query.equal("city", city),
          Query.equal("status", "ACTIVE"),
          Query.notEqual("userId", user.$id),
        ]
      );
      return res.documents || [];
    },
  });

  if (!city) return <p>Please set your city in Profile.</p>;
  if (isLoading) return <p>Loading requests...</p>;

  return (
    <div className="space-y-4">
    
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Nearby Help Requests</h2>
        <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm">
          {data.length}
        </span>
      </div>

      {data.length === 0 && (
        <p className="text-gray-500">No active help requests nearby.</p>
      )}

      {data.map((req, index) => (
        <div
          key={req.$id}
          className="border p-4 rounded-lg bg-white shadow"
        >
          <p className="text-sm text-gray-500 mb-1">
            Request #{index + 1}
          </p>

          <p><strong>Help Type:</strong> {req.helptype}</p>
          <p><strong>Name:</strong> {req.requestName}</p>
          <p><strong>Phone:</strong> {req.requestPhone}</p>
          <p><strong>City:</strong> {req.city}</p>

          <Link
            to={`/dashboard/help-requests/${req.$id}`}
            className="inline-block mt-3 text-indigo-600 font-medium hover:underline"
          >
            <Button>Approve help</Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default HelpRequestList;
