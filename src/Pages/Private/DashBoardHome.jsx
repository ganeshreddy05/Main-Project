import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import { MapIcon, Users, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import RoadReportCard from "./RoadReportsfile/RoadReportCard";
import HelpRequestCard from "./HelpRequests/HelpRequestCard";

const DashboardHome = () => {
  const { profile } = useAuth();
  const district = profile?.district;

  // ROAD REPORTS QUERY (Case-insensitive district matching)
  const { data: roadReports = [] } = useQuery({
    queryKey: ["dashboard-road-reports", district],
    enabled: !!district,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(50)]
      );
      const filtered = res.documents.filter(
        (doc) => doc.district?.toLowerCase() === district?.toLowerCase()
      );
      return filtered.slice(0, 6); // Get 6 for horizontal display
    },
  });

  // HELP REQUESTS QUERY (Case-insensitive district matching)
  const { data: helpRequests = [] } = useQuery({
    queryKey: ["dashboard-help-requests", district],
    enabled: !!district,
    queryFn: async () => {
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_HELP_REQUESTS_COLLECTION_ID,
        [Query.orderDesc("$createdAt"), Query.limit(50)]
      );
      const filtered = res.documents.filter(
        (doc) => doc.district?.toLowerCase() === district?.toLowerCase()
      );
      return filtered.slice(0, 6); // Get 6 for horizontal display
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {profile?.name}
          </span>
        </h1>
        <p className="text-gray-600">Here's what's happening in your area today</p>
      </div>

      {/* THREE STAT CARDS - TOP ROW */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* ROAD REPORTS STAT CARD */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <MapIcon className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Road Reports</h2>
                <p className="text-xs text-gray-500">In your district</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {roadReports.length}
              </p>
              <div className="flex items-center gap-1 text-emerald-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Active</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Total reports</p>
          </div>

          <Link
            to="/dashboard/road-reports"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-lg font-medium hover:from-emerald-700 hover:to-teal-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* HELP REQUESTS STAT CARD */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Users className="w-6 h-6 text-cyan-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Help Requests</h2>
                <p className="text-xs text-gray-500">Community support</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {helpRequests.length}
              </p>
              <div className="flex items-center gap-1 text-cyan-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Active</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Total requests</p>
          </div>

          <Link
            to="/dashboard/help-requests"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* TRAVEL REQUESTS STAT CARD */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Briefcase className="w-6 h-6 text-violet-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Travel Requests</h2>
                <p className="text-xs text-gray-500">Journey planning</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                0
              </p>
              <span className="text-sm text-gray-500">trips</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Upcoming journeys</p>
          </div>

          <Link
            to="/dashboard/travel-requests"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* ROAD REPORTS SECTION - HORIZONTAL CARDS */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Road Reports</h2>
          <Link
            to="/dashboard/road-reports"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {roadReports.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">No road reports yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roadReports.map((report) => (
              <RoadReportCard key={report.$id} report={report} />
            ))}
          </div>
        )}
      </div>

      {/* HELP REQUESTS SECTION - HORIZONTAL CARDS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Help Requests</h2>
          <Link
            to="/dashboard/help-requests"
            className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {helpRequests.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">No help requests yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {helpRequests.map((request) => (
              <HelpRequestCard key={request.$id} request={request} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
