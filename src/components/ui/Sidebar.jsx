import { NavLink, useNavigate } from "react-router-dom";
import authService from "@/services/authService";

const Sidebar = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await authService.logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium
     ${
       isActive
         ? "bg-indigo-100 text-indigo-700 shadow-sm"
         : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
     }`;

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-slate-50 to-slate-100 p-4 shadow-lg rounded-r-3xl">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h2 className="text-2xl font-bold text-indigo-700">
          Turn The Wheel
        </h2>
        <p className="text-xs text-slate-500">Travel & Safety Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink to="/dashboard" end className={linkClass}>
          🏠 Dashboard
        </NavLink>

        <NavLink to="/dashboard/help-requests" className={linkClass}>
          🚨 Help Requests
        </NavLink>

        <NavLink to="/dashboard/travel-requests" className={linkClass}>
          🧳 Travel Requests
        </NavLink>

        <NavLink to="/dashboard/road-reports" className={linkClass}>
          🛣 Road Reports
        </NavLink>

        <NavLink to="/dashboard/my-history" className={linkClass}>
          📜 My History
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkClass}>
          👤 Profile
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6">
        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-100 transition font-medium"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
