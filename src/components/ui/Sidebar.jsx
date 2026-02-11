import { NavLink, useNavigate } from "react-router-dom";
import authService from "@/services/authService";
import { Home, AlertCircle, Briefcase, MapIcon, History, User, LogOut } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await authService.logout();
    navigate("/");
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
    { to: "/dashboard/help-requests", label: "Help Requests", icon: AlertCircle },
    { to: "/dashboard/travel-requests", label: "Travel Requests", icon: Briefcase },
    { to: "/dashboard/road-reports", label: "Road Reports", icon: MapIcon },
    { to: "/dashboard/my-history", label: "My History", icon: History },
    { to: "/dashboard/profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-emerald-50 via-white to-emerald-50/30 border-r border-gray-200 p-4 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
            <MapIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
            Turn The Wheel
          </h2>
        </div>
        <p className="text-xs text-gray-500 ml-10">Travel & Safety Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md transform scale-[1.02]"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500"}`} />
                  <span className="font-medium">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

    </aside>
  );
};

export default Sidebar;
