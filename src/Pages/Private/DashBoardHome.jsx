import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import { Link } from "react-router-dom";
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
    <div className="p-6">
      <div className="grid md:grid-cols-3 gap-6">

        {/* ROAD REPORTS COLUMN */}
        <div className="space-y-4">
          {/* Road Reports Main Card */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-3xl shadow">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Road Reports</h2>
              <Link
                to="/dashboard/road-reports"
                className="bg-white text-indigo-600 px-3 py-1 rounded-lg font-medium text-sm"
              >
                View All
              </Link>
            </div>

            <p className="text-3xl font-bold mt-3">{roadReports.length}</p>
            <p className="text-sm">Reports in your district</p>
          </div>

          {/* Recent Road Reports */}
          <div className="space-y-3">
            {roadReports.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No reports yet</p>
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
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white p-6 rounded-3xl shadow">
            <h2 className="text-xl font-bold">Help Requests</h2>
            <Link
              to="/dashboard/help-requests"
              className="mt-3 inline-block bg-white text-green-600 px-4 py-2 rounded-xl text-sm"
            >
              View All
            </Link>
          </div>

          {/* Help Request Cards will go here in future */}
          <div className="text-gray-500 text-sm text-center py-4">
            No help requests
          </div>
        </div>

        {/* TRAVEL REQUESTS COLUMN */}
        <div className="space-y-4">
          {/* Travel Requests Main Card */}
          <div className="bg-gradient-to-br from-orange-500 to-yellow-500 text-white p-6 rounded-3xl shadow">
            <h2 className="text-xl font-bold">Travel Requests</h2>
            <Link
              to="/dashboard/travel-requests"
              className="mt-3 inline-block bg-white text-orange-600 px-4 py-2 rounded-xl text-sm"
            >
              View All
            </Link>
          </div>

          {/* Travel Request Cards will go here in future */}
          <div className="text-gray-500 text-sm text-center py-4">
            No travel requests
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
