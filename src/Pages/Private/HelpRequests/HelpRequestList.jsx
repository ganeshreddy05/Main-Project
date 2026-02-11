import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import HelpRequestCard from "./HelpRequestCard";
import { Loader2 } from "lucide-react";

const HelpRequestList = () => {
  const { user, profile } = useAuth();
  const district = profile?.district;

  const { data: helpRequests = [], isLoading } = useQuery({
    queryKey: ["help-requests", district],
    enabled: !!district && !!user,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        [
          Query.orderDesc("$createdAt"),
          Query.limit(50),
        ]
      );

      // Filter by same district but exclude own requests
      return res.documents.filter(
        (doc) =>
          doc.district?.toLowerCase() === district?.toLowerCase() &&
          doc.userId !== user.$id
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!helpRequests.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No help requests from your district yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Help Requests from {district}
        </h2>
        <span className="text-sm text-gray-500">{helpRequests.length} requests</span>
      </div>

      {/* Horizontal scrollable grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
        {helpRequests.map((request) => (
          <div key={request.$id} className="flex-shrink-0 w-80 snap-start">
            <HelpRequestCard request={request} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpRequestList;
