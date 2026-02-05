import { Link } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import { Map, FileText, Search } from "lucide-react";

const RoadReportsMenu = () => {
    const { profile } = useAuth();
    const district = profile?.district;
    const state = profile?.state;

    const menuCards = [
        {
            title: "Report a Road",
            description: `Report road conditions in ${district || "your district"}`,
            icon: FileText,
            link: "/dashboard/road-reports/create",
            gradient: "from-blue-500 to-indigo-600",
        },
        {
            title: "My District Reports",
            description: `View reports in ${district || "your district"}`,
            icon: Map,
            link: "/dashboard/road-reports/my-district",
            gradient: "from-green-500 to-emerald-600",
        },
        {
            title: "Other Districts",
            description: "Browse reports from other districts",
            icon: Search,
            link: "/dashboard/road-reports/all",
            gradient: "from-orange-500 to-yellow-500",
        },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Road Reports</h1>
                <p className="text-gray-600 mt-2">
                    Report road conditions and browse reports from your community
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {menuCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link
                            key={card.title}
                            to={card.link}
                            className={`bg-gradient-to-br ${card.gradient} text-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105`}
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="bg-white/20 p-4 rounded-full">
                                    <Icon size={40} />
                                </div>
                                <h2 className="text-2xl font-bold">{card.title}</h2>
                                <p className="text-white/90">{card.description}</p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default RoadReportsMenu;
