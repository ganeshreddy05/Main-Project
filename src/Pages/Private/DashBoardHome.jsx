import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
import { MapIcon, Users, Briefcase, TrendingUp, ArrowRight } from "lucide-react";
import RoadReportCard from "./RoadReportsfile/RoadReportCard";

const DashboardHome = () => {
  const { profile } = useAuth();
  const district = profile?.district;

  // ROAD REPORTS QUERY (Case-insensitive district matching)
  const { data: roadReports = [] } = useQuery({
    queryKey: ["dashboard-road-reports", district],
    enabled: !!district,
    queryFn: async () => {
      console.log("=== DASHBOARD QUERY ===");
      console.log("User's district from profile:", district);

      // Fetch all reports and filter client-side for case-insensitive matching
      const res = await databases.listDocuments(
        import.meta.env.VITE_DATABASE_ID,
        import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
        [
          Query.orderDesc("$createdAt"),
          Query.limit(50), // Get more to filter client-side
        ]
      );

      console.log("Total reports fetched:", res.documents.length);
      console.log("All reports:", res.documents.map(d => ({ id: d.$id, district: d.district })));

      // Filter case-insensitively
      const filtered = res.documents
        .filter(doc => doc.district?.toLowerCase() === district?.toLowerCase());

      console.log("Filtered reports for district:", filtered.length);

      return filtered.slice(0, 3); // Limit to 3 after filtering
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Welcome back, <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{profile?.name}</span>
        </h1>
        <p className="text-gray-600">Here's what's happening in your area today</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* ROAD REPORTS COLUMN */}
        <div className="space-y-4">
          {/* Road Reports Main Card */}
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

          {/* Recent Road Reports */}
          <div className="space-y-3">
            {roadReports.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-gray-500 text-sm">No reports yet</p>
              </div>
            )}

            {roadReports
              .sort((a, b) => (b.likes || 0) - (a.likes || 0))
              .map((r) => (
                <RoadReportCard key={r.$id} report={r} />
              ))}
          </div>
        </div>

        {/* HELP REQUESTS COLUMN */}
        <div className="space-y-4">
          {/* Help Requests Main Card */}
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
                  0
                </p>
                <span className="text-sm text-gray-500">requests</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">Pending assistance</p>
            </div>

            <Link
              to="/dashboard/help-requests"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:from-cyan-700 hover:to-blue-700 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Help Request Cards will go here in future */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">No help requests</p>
          </div>
        </div>

        {/* TRAVEL REQUESTS COLUMN */}
        <div className="space-y-4">
          {/* Travel Requests Main Card */}
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

          {/* Travel Request Cards will go here in future */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <p className="text-gray-500 text-sm">No travel requests</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
