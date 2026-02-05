import { useQuery } from "@tanstack/react-query";
import { databases, Query } from "@/services/appwriteConfig";
import { useAuth } from "@/context/useAuth";
import RoadReportCard from "./RoadReportCard";

const MyDistrictReports = () => {
    const { profile } = useAuth();
    const state = profile?.state;
    const district = profile?.district;

    const { data: reports = [], isLoading } = useQuery({
        queryKey: ["road-reports", state, district],
        enabled: !!district,
        queryFn: async () => {
            // Fetch all reports and filter client-side for case-insensitive matching
            const res = await databases.listDocuments(
                import.meta.env.VITE_DATABASE_ID,
                import.meta.env.VITE_ROAD_REPORTS_COLLECTION_ID,
                [
                    Query.orderDesc("$createdAt"),
                    Query.limit(100), // Get more to filter client-side
                ]
            );
            // Filter case-insensitively for both state and district
            return res.documents.filter(
                doc =>
                    doc.state?.toLowerCase() === state?.toLowerCase() &&
                    doc.district?.toLowerCase() === district?.toLowerCase()
            );
        },
    });

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold">
                    Reports in {district}, {state}
                </h1>
                <p className="text-gray-600 mt-1">
                    All road reports from your district
                </p>
            </div>

            {isLoading && (
                <div className="text-center py-8">
                    <p className="text-gray-500">Loading reports...</p>
                </div>
            )}

            {!isLoading && reports.length === 0 && (
                <div className="text-center py-8 bg-white rounded-2xl shadow">
                    <p className="text-gray-500">No reports found in your district</p>
                </div>
            )}

            {/* Vertical column layout, sorted by likes */}
            <div className="max-w-2xl space-y-4">
                {reports
                    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
                    .map((report) => (
                        <RoadReportCard key={report.$id} report={report} />
                    ))}
            </div>
        </div>
    );
};

export default MyDistrictReports;
