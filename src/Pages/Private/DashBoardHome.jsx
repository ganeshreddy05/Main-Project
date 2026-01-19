import { useNavigate } from "react-router-dom";

const DashboardCard = ({ title, description, path, color }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className={`cursor-pointer p-6 rounded-xl shadow-lg text-white ${color}`}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 opacity-90">{description}</p>
    </div>
  );
};

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
    
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/dashboard/help-requests")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700"
        >
          + Request Help
        </button>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <DashboardCard
          title="Help Requests"
          description="People nearby requesting help"
          path="/dashboard/help-requests"
          color="bg-gradient-to-r from-indigo-500 to-purple-600"
        />

        <DashboardCard
          title="Travel Requests"
          description="Ride & travel related alerts"
          path="/dashboard/travel-requests"
          color="bg-gradient-to-r from-green-500 to-emerald-600"
        />

        <DashboardCard
          title="Road Reports"
          description="Accidents & road conditions"
          path="/dashboard/road-reports"
          color="bg-gradient-to-r from-orange-500 to-red-500"
        />
      </div>
    </div>
  );
};

export default DashboardHome;
