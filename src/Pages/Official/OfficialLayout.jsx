import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";
import {
    LayoutDashboard,
    Briefcase,
    User,
    LogOut,
    Bell
} from "lucide-react";

const OfficialLayout = () => {
    const { logout, profile } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            navigate("/");
            window.location.reload();
        }
    };

    const navItems = [
        { path: "/official/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/official/dashboard/work-orders", icon: Briefcase, label: "Work Orders" },
        { path: "/official/dashboard/profile", icon: User, label: "Profile" },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-amber-500 p-2 rounded-lg">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900">Official Portal</h1>
                                <p className="text-xs text-gray-500">Fix My District</p>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-4">
                            {/* Department Badge */}
                            <div className="hidden md:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
                                <Briefcase className="w-4 h-4 text-amber-600" />
                                <span className="text-sm font-medium text-amber-700">
                                    {profile?.department?.replace(/_/g, " ") || "Department"}
                                </span>
                            </div>

                            {/* Notifications */}
                            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-md transition">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
                            </button>

                            {/* Official Info */}
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">{profile?.name}</p>
                                    <p className="text-xs text-amber-600">Official</p>
                                </div>
                                <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">
                                        {profile?.name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout */}
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] sticky top-[73px]">
                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/official/dashboard"}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-md transition ${isActive
                                            ? "bg-amber-50 text-amber-700 font-medium"
                                            : "text-gray-700 hover:bg-gray-100"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon className={`w-5 h-5 ${isActive ? "text-amber-600" : "text-gray-500"}`} />
                                            <span>{item.label}</span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default OfficialLayout;
