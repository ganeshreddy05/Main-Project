import { NavLink, useNavigate } from "react-router-dom";
import authService from "@/services/authService";

const Sidebar = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await authService.logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium
     ${
       isActive
         ? "bg-white/20 text-white"
         : "text-indigo-100 hover:bg-white/10 hover:text-white"
     }`;

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-600 to-violet-700 p-5 text-white">
    
      <h2 className="text-2xl font-extrabold mb-10 tracking-wide">
        <link rel="stylesheet" href="logo.png" /> Turn The Wheel
      </h2>

      {/* Navigation */}
      <nav className="space-y-2">
        <NavLink to="/dashboard" end className={linkClass}>
           Dashboard
        </NavLink>

        <NavLink to="/dashboard/help-requests" className={linkClass}>
           Help Requests
        </NavLink>
        <NavLink to="/dashboard/my-requests" className={linkClass}>
          My Requests
        </NavLink>

        <NavLink to="/dashboard/travel-requests" className={linkClass}>
           Travel Requests
        </NavLink>

        <NavLink to="/dashboard/road-reports" className={linkClass}>
           Road Reports
        </NavLink>

        <NavLink to="/dashboard/profile" className={linkClass}>
           Profile
        </NavLink>
      </nav>

      
      <div className="mt-10">
        <button
          onClick={logoutHandler}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg
                     bg-red-500/90 hover:bg-red-600 transition font-medium"
        >
           Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
