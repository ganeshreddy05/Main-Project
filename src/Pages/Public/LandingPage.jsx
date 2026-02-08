import { Link } from "react-router-dom";
import { useState } from "react";
import { MapPin, Users, Car, Shield, ChevronDown } from "lucide-react";

const LandingPage = () => {
    const [showLoginMenu, setShowLoginMenu] = useState(false);

    const features = [
        {
            icon: MapPin,
            title: "Road Reports",
            description: "Report road conditions, potholes, and hazards. Help make your community safer.",
        },
        {
            icon: Users,
            title: "Help Requests",
            description: "Request or offer help to fellow travelers. Build a supportive community.",
        },
        {
            icon: Car,
            title: "Travel Requests",
            description: "Find travel companions, share rides, and make journeys more enjoyable.",
        },
    ];

    const loginOptions = [
        {
            title: "Login as Citizen",
            description: "Report issues and help your community",
            link: "/login",
        },
        {
            title: "Login as MLA",
            description: "Access constituency reports",
            link: "/mla/login",
        },
        {
            title: "Login as Admin",
            description: "Manage system",
            link: "/admin/login",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-2 rounded-lg shadow-md">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-xl font-semibold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                                Turn The Wheel
                            </h1>
                        </div>

                        {/* Login & Register Buttons */}
                        <div className="flex gap-3 items-center relative">
                            {/* Login Button with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLoginMenu(!showLoginMenu)}
                                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition font-medium flex items-center gap-2"
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
                                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                                            <div className="p-3 bg-gray-50 border-b border-gray-200">
                                                <h3 className="text-gray-900 font-semibold text-sm">Choose Login Type</h3>
                                                <p className="text-gray-600 text-xs">Select your role to continue</p>
                                            </div>

                                            <div className="p-2">
                                                {loginOptions.map((option, index) => (
                                                    <Link
                                                        key={index}
                                                        to={option.link}
                                                        onClick={() => setShowLoginMenu(false)}
                                                        className="block p-3 hover:bg-gray-50 rounded-md transition"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-blue-700 rounded-md flex items-center justify-center text-white">
                                                                <Shield className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-medium text-gray-900 text-sm">
                                                                    {option.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-600">{option.description}</p>
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
                                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all font-medium"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-6 py-16 text-center">
                <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                    Building Better Communities Together
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
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
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-3xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stat.value}</div>
                            <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h3 className="text-3xl font-semibold text-gray-900 mb-3">Our Features</h3>
                    <p className="text-lg text-gray-600">Everything you need to make a difference</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <Icon className="w-6 h-6 text-emerald-700" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h4>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-16">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-12 text-center text-white shadow-xl">
                    <h3 className="text-3xl font-semibold mb-3">Ready to Make a Difference?</h3>
                    <p className="text-lg mb-8 text-emerald-50">
                        Join our community and help build safer roads for everyone
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-6 py-3 bg-white text-blue-700 rounded-md font-medium hover:bg-gray-100 transition"
                    >
                        Get Started Free →
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                        <div className="bg-blue-700 p-2 rounded-lg">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <h1 className="text-lg font-semibold">Turn The Wheel</h1>
                    </div>
                    <p className="text-gray-400 text-sm">
                        Making roads safer, one report at a time.
                    </p>
                    <p className="text-gray-500 text-xs mt-3">
                        &copy; 2026 Turn The Wheel. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
