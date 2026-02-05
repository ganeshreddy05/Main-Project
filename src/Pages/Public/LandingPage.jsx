import { Link } from "react-router-dom";
import { useState } from "react";
import { MapPin, Users, Car, Shield, X, ChevronDown } from "lucide-react";

const LandingPage = () => {
    const [showLoginMenu, setShowLoginMenu] = useState(false);

    const features = [
        {
            icon: MapPin,
            title: "Road Reports",
            description: "Report road conditions, potholes, and hazards. Help make your community safer.",
            color: "bg-blue-500",
            lightColor: "bg-blue-50",
        },
        {
            icon: Users,
            title: "Help Requests",
            description: "Request or offer help to fellow travelers. Build a supportive community.",
            color: "bg-green-500",
            lightColor: "bg-green-50",
        },
        {
            icon: Car,
            title: "Travel Requests",
            description: "Find travel companions, share rides, and make journeys more enjoyable.",
            color: "bg-orange-500",
            lightColor: "bg-orange-50",
        },
    ];

    const loginOptions = [
        {
            title: "Login as Citizen",
            description: "Report issues and help your community",
            link: "/login",
            color: "bg-blue-500 hover:bg-blue-600",
        },
        {
            title: "Login as MLA",
            description: "Access constituency reports",
            link: "/mla/login",
            color: "bg-purple-500 hover:bg-purple-600",
        },
        {
            title: "Login as Admin",
            description: "Manage system",
            link: "/admin/login",
            color: "bg-red-500 hover:bg-red-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Turn The Wheel
                            </h1>
                        </div>

                        {/* Login & Register Buttons */}
                        <div className="flex gap-3 items-center relative">
                            {/* Login Button with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLoginMenu(!showLoginMenu)}
                                    className="px-6 py-2 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-semibold flex items-center gap-2"
                                >
                                    Login
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showLoginMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Login Dropdown Menu */}
                                {showLoginMenu && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowLoginMenu(false)}
                                        />

                                        {/* Dropdown */}
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                                            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600">
                                                <h3 className="text-white font-bold text-lg">Choose Login Type</h3>
                                                <p className="text-indigo-100 text-sm">Select your role to continue</p>
                                            </div>

                                            <div className="p-2">
                                                {loginOptions.map((option, index) => (
                                                    <Link
                                                        key={index}
                                                        to={option.link}
                                                        onClick={() => setShowLoginMenu(false)}
                                                        className="block p-4 hover:bg-gray-50 rounded-lg transition group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center text-white`}>
                                                                <Shield className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                                                                    {option.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-500">{option.description}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Register Button */}
                            <Link
                                to="/register"
                                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Building Better
                    <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Communities Together
                    </span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Report road issues, request help, and connect with your community.
                    Join thousands making a real difference in road safety.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                    {[
                        { label: "Active Users", value: "10K+" },
                        { label: "Reports", value: "25K+" },
                        { label: "Resolved", value: "15K+" },
                        { label: "Impact", value: "98%" },
                    ].map((stat, index) => (
                        <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                            <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h3 className="text-4xl font-bold text-gray-900 mb-4">Our Features</h3>
                    <p className="text-xl text-gray-600">Everything you need to make a difference</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-2"
                            >
                                <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-12 text-center text-white">
                    <h3 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h3>
                    <p className="text-xl mb-8 opacity-90">
                        Join our community and help build safer roads for everyone
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                    >
                        Get Started Free →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold">Turn The Wheel</h1>
                    </div>
                    <p className="text-gray-400">
                        Making roads safer, one report at a time.
                    </p>
                    <p className="text-gray-500 text-sm mt-4">
                        &copy; 2026 Turn The Wheel. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
