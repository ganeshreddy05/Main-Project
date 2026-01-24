import { useQuery } from "@tanstack/react-query";
import dbService from "@/services/dbServices";
import { useAuth } from "@/context/useAuth";

const MyHelpRequests = () => {
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["my-help-requests", user?.$id],
    enabled: !!user,
    queryFn: () => dbService.getMyHelpRequests(user.$id),
  });

  if (isLoading) return <p>Loading your requests...</p>;

  if (data.documents.length === 0) {
    return <p className="text-gray-500">No help requests yet</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-indigo-700">My Help Requests</h2>

      {data.documents.map((req) => (
        <div
          key={req.$id}
          className="p-4 bg-white rounded-lg shadow border-l-4 border-indigo-600"
        >
          <div className="flex justify-between">
            <span className="font-semibold">{req.helptype}</span>
            <span className="text-sm text-gray-500">{req.status}</span>
          </div>

          <p className="text-gray-600 mt-2">{req.description}</p>
          <p className="text-sm text-gray-400 mt-1">City: {req.city}</p>
        </div>
      ))}
    </div>
  );
};

export default MyHelpRequests;
