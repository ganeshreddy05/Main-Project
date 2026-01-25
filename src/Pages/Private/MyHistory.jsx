import { Link } from "react-router-dom";

const MyHistory = () => {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700">My History</h1>

      <div className="grid md:grid-cols-3 gap-6">

        {/* Road Reports History */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold">My Road Reports</h2>
          <p className="mt-2">View all road issues you reported</p>
          <Link
            to="/dashboard/my-history/road-reports"
            className="inline-block mt-4 bg-white text-blue-700 px-4 py-2 rounded-xl font-semibold"
          >
            View
          </Link>
        </div>

        {/* Help Requests History */}
        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold">My Help Requests</h2>
          <p className="mt-2">Requests you created for help</p>
          <Link
            to="/dashboard/my-history/help-requests"
            className="inline-block mt-4 bg-white text-green-700 px-4 py-2 rounded-xl font-semibold"
          >
            View
          </Link>
        </div>

        {/* Travel Requests History */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-3xl p-6 shadow-xl">
          <h2 className="text-xl font-semibold">My Travel Requests</h2>
          <p className="mt-2">Your travel related posts</p>
          <Link
            to="/dashboard/my-history/travel-requests"
            className="inline-block mt-4 bg-white text-orange-700 px-4 py-2 rounded-xl font-semibold"
          >
            View
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MyHistory;
