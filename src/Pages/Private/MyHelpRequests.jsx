import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import { Plus, Loader2 } from "lucide-react";
import HelpRequestCard from "./HelpRequests/HelpRequestCard";
import { Button } from "@/components/ui/button";

const MyHelpRequests = () => {
  const { user } = useAuth();

  // Fetch user's own help requests
  const {
    data: helpRequests = [],
    isLoading,
  } = useQuery({
    queryKey: ["my-help-requests", user?.$id],
    enabled: !!user,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        [
          Query.equal("userId", user.$id),
          Query.orderDesc("$createdAt"),
        ]
      );
      return res.documents || [];
    },
  });

  // Stats
  const pending = helpRequests.filter(r => r.status === "PENDING").length;
  const inProgress = helpRequests.filter(r => r.status === "IN_PROGRESS").length;
  const resolved = helpRequests.filter(r => r.status === "RESOLVED").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Help Requests</h1>
          <p className="text-gray-600 mt-1">Track your community issue reports</p>
        </div>
        <Link to="/dashboard/help-requests">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-3xl font-bold text-gray-900">{helpRequests.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pending}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">{inProgress}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">Resolved</p>
          <p className="text-3xl font-bold text-green-600">{resolved}</p>
        </div>
      </div>

      {/* Help Requests List */}
      <div className="space-y-4">
        {helpRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500 mb-4">You haven't created any help requests yet</p>
            <Link to="/dashboard/help-requests">
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Request
              </Button>
            </Link>
          </div>
        ) : (
          helpRequests.map((request) => (
            <HelpRequestCard
              key={request.$id}
              request={request}
              showActions={true} // Show resolve/delete buttons for own requests
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MyHelpRequests;
