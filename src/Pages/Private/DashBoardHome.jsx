import { Link } from "react-router-dom";

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Road Reports */}
        <div className="bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Road Reports</h2>
            <Link
              to="/dashboard/road-reports"
              className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition"
            >
              Report
            </Link>
          </div>

          <p className="mt-3 text-sm text-slate-200">
            Latest road conditions in your district
          </p>

          <div className="mt-4 space-y-2">
            <div className="bg-white/10 rounded-xl p-3">Hyderabad → Warangal</div>
            <div className="bg-white/10 rounded-xl p-3">Kurnool → Nandyal</div>
          </div>
        </div>

        {/* Help Requests */}
        <div className="bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Help Requests</h2>
            <Link
              to="/dashboard/help-requests"
              className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition"
            >
              Request
            </Link>
          </div>

          <p className="mt-3 text-sm text-emerald-100">
            People nearby who need assistance
          </p>

          <div className="mt-4 space-y-2">
            <div className="bg-white/10 rounded-xl p-3">Petrol needed</div>
            <div className="bg-white/10 rounded-xl p-3">Vehicle breakdown</div>
          </div>
        </div>

        {/* Travel Requests */}
        <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-3xl p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Travel Requests</h2>
            <Link
              to="/dashboard/travel-requests"
              className="bg-white/20 backdrop-blur px-4 py-2 rounded-xl text-sm hover:bg-white/30 transition"
            >
              Create
            </Link>
          </div>

          <p className="mt-3 text-sm text-rose-100">
            Recent travel updates & alerts
          </p>

          <div className="mt-4 space-y-2">
            <div className="bg-white/10 rounded-xl p-3">Hyderabad → Vijayawada</div>
            <div className="bg-white/10 rounded-xl p-3">Traffic delay alert</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHome;
