import { Link } from "react-router-dom";
import { MapIcon, Users, ArrowRight } from "lucide-react";

const MyHistory = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">My History</h1>

      <div className="grid md:grid-cols-2 gap-6">

        {/* Road Reports History — matches dashboard emerald/teal */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <MapIcon className="w-6 h-6" />
            <h2 className="text-xl font-semibold">My Road Reports</h2>
          </div>
          <p className="mt-2 text-emerald-100">View all road issues you reported</p>
          <Link
            to="/dashboard/my-history/road-reports"
            className="inline-flex items-center gap-2 mt-4 bg-white text-emerald-700 px-4 py-2 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
          >
            View <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Help Requests History — matches dashboard cyan/blue */}
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6" />
            <h2 className="text-xl font-semibold">My Help Requests</h2>
          </div>
          <p className="mt-2 text-cyan-100">Requests you created for help</p>
          <Link
            to="/dashboard/my-history/help-requests"
            className="inline-flex items-center gap-2 mt-4 bg-white text-cyan-700 px-4 py-2 rounded-xl font-semibold hover:bg-cyan-50 transition-colors"
          >
            View <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MyHistory;
