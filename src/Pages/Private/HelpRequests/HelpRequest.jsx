import { useState } from "react";
import { FileText, MapPin, Globe, Plus } from "lucide-react";
import { useAuth } from "@/context/useAuth";
import CreateHelpRequest from "./CreateHelpRequest";
import HelpRequestList from "./HelpRequestList";
import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import HelpRequestCard from "./HelpRequestCard";

const HelpRequest = () => {
  const { user, profile } = useAuth();
  const [activeView, setActiveView] = useState(null); // null | 'create' | 'district' | 'other'
  const district = profile?.district;

  // Fetch district requests
  const { data: districtRequests = [], isLoading: districtLoading } = useQuery({
    queryKey: ["district-help-requests", district],
    enabled: !!district && !!user && activeView === 'district',
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(50)]
      );
      return res.documents.filter(
        (doc) =>
          doc.district?.toLowerCase() === district?.toLowerCase() &&
          doc.userId !== user.$id
      );
    },
  });

  // Fetch other districts requests
  const { data: otherRequests = [], isLoading: otherLoading } = useQuery({
    queryKey: ["other-help-requests", district],
    enabled: !!district && !!user && activeView === 'other',
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(50)]
      );
      return res.documents.filter(
        (doc) => doc.district?.toLowerCase() !== district?.toLowerCase()
      );
    },
  });

  // If a view is selected, show that view
  if (activeView === 'create') {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => setActiveView(null)}
          className="mb-4 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          ← Back to Help Requests
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Report a Help Request</h1>
        <CreateHelpRequest onSubmitted={() => setActiveView(null)} />
      </div>
    );
  }

  if (activeView === 'district') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => setActiveView(null)}
          className="mb-4 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          ← Back to Help Requests
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My District Requests</h1>
        <p className="text-gray-600 mb-6">View help requests in {district}</p>

        {districtLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : districtRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500">No requests from your district yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {districtRequests.map((request) => (
              <HelpRequestCard key={request.$id} request={request} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (activeView === 'other') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <button
          onClick={() => setActiveView(null)}
          className="mb-4 text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
        >
          ← Back to Help Requests
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Other Districts</h1>
        <p className="text-gray-600 mb-6">Browse help requests from other districts</p>

        {otherLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : otherRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
            <p className="text-gray-500">No requests from other districts yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherRequests.map((request) => (
              <HelpRequestCard key={request.$id} request={request} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Main view with 3 big cards
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Help Requests</h1>
        <p className="text-gray-600">Report community infrastructure issues in your area</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* CARD 1: Report a Request */}
        <button
          onClick={() => setActiveView('create')}
          className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <FileText className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Report a Request</h2>
              <p className="text-blue-100">Report community issues in your area</p>
            </div>
          </div>
        </button>

        {/* CARD 2: My District Requests */}
        <button
          onClick={() => setActiveView('district')}
          className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <MapPin className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">My District Requests</h2>
              <p className="text-emerald-100">View requests in {district || "your district"}</p>
            </div>
          </div>
        </button>

        {/* CARD 3: Other Districts */}
        <button
          onClick={() => setActiveView('other')}
          className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white hover:shadow-xl transition-all duration-300 hover:scale-105 group"
        >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Globe className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Other Districts</h2>
              <p className="text-orange-100">Browse requests from other districts</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HelpRequest;
