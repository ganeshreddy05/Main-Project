import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
    MapPin, Users, Car, Shield, ChevronDown, Building2, Settings,
    ArrowRight, CheckCircle, Star, Zap, Globe, Phone, MessageCircle,
    TrendingUp, Clock, Award, ChevronRight, Menu, X, Landmark, ShieldCheck, CircleDot
} from "lucide-react";

const LandingPage = () => {
    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);

    // Scroll detection for navbar
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto-rotate testimonials
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const features = [
        {
            icon: MapPin,
            title: "Road Reports",
            description: "Report potholes, damaged roads, and hazards in your district. Help authorities prioritize repairs.",
            gradient: "from-red-500 to-rose-600",
            lightBg: "bg-red-50",
            iconColor: "text-red-600",
        },
        {
            icon: Users,
            title: "Help Requests",
            description: "Request assistance from your MLA or community. Get help for emergencies, infrastructure, and civic issues.",
            gradient: "from-amber-500 to-orange-600",
            lightBg: "bg-amber-50",
            iconColor: "text-amber-600",
        },
        {
            icon: MessageCircle,
            title: "Direct MLA Connect",
            description: "Connect directly with your elected representative. Track their responses and actions on your reports.",
            gradient: "from-emerald-500 to-teal-600",
            lightBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
        },
    ];

    const stats = [
        { label: "Active Citizens", value: "10K+", icon: Users },
        { label: "Issues Reported", value: "25K+", icon: MapPin },
        { label: "Issues Resolved", value: "15K+", icon: CheckCircle },
        { label: "Districts Covered", value: "50+", icon: Globe },
    ];

    const steps = [
        { step: "01", title: "Report an Issue", description: "Upload photos, mark location, and describe the problem in your district.", icon: Phone },
        { step: "02", title: "MLA Reviews", description: "Your elected MLA receives the report and assigns it to the relevant department.", icon: TrendingUp },
        { step: "03", title: "Track Progress", description: "Get real-time updates as the department works on fixing the issue.", icon: Clock },
        { step: "04", title: "Issue Resolved", description: "Celebrate! The issue is fixed and your district becomes a better place.", icon: Award },
    ];

    const testimonials = [
        {
            name: "Rajesh Kumar",
            role: "Citizen, Hyderabad",
            text: "Fix My District helped me report a pothole that had been ignored for months. It was fixed within a week!",
            avatar: "RK",
        },
        {
            name: "Priya Sharma",
            role: "Citizen, Warangal",
            text: "Finally a platform where my voice is heard. The MLA actually responded to my help request within 24 hours.",
            avatar: "PS",
        },
        {
            name: "Anil Reddy",
            role: "Citizen, Vizag",
            text: "I've reported 12 road issues so far and 10 have been resolved. This platform actually works!",
            avatar: "AR",
        },
    ];

    const loginOptions = [
        {
            title: "Login as Citizen",
            description: "Report issues and help your community",
            link: "/login",
            icon: CircleDot,
            color: "bg-emerald-600",
        },
        {
            title: "Login as Government Official",
            description: "For MLAs and Department Officials",
            link: "/mla/login",
            icon: Landmark,
            color: "bg-red-600",
        },
        {
            title: "Login as Admin",
            description: "Manage system",
            link: "/admin/login",
            icon: ShieldCheck,
            color: "bg-gray-700",
        },
    ];

    // Animated counter component
    const AnimatedCounter = ({ target, suffix = "" }) => {
        const [count, setCount] = useState(0);
        const ref = useRef(null);
        const [isVisible, setIsVisible] = useState(false);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setIsVisible(true);
                },
                { threshold: 0.3 }
            );
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, []);

        useEffect(() => {
            if (!isVisible) return;
            const num = parseInt(target);
            const duration = 2000;
            const step = Math.ceil(num / (duration / 16));
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= num) {
                    setCount(num);
                    clearInterval(timer);
                } else {
                    setCount(current);
                }
            }, 16);
            return () => clearInterval(timer);
        }, [isVisible, target]);

        return <span ref={ref}>{count}{suffix}</span>;
    };

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* ===== NAVBAR ===== */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-100"
                    : "bg-transparent"
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                                    <MapPin className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <h1 className={`text-xl font-extrabold tracking-tight ${scrolled ? "text-gray-900" : "text-white"}`}>
                                    Fix My District
                                </h1>
                                <p className={`text-[10px] font-semibold tracking-widest uppercase ${scrolled ? "text-red-600" : "text-red-300"}`}>
                                    Citizen Platform
                                </p>
                            </div>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex gap-3 items-center">
                            {/* Login Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowLoginMenu(!showLoginMenu)}
                                    className={`px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all duration-200 ${scrolled
                                        ? "bg-white border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600"
                                        : "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                                        }`}
                                >
                                    Login
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showLoginMenu ? "rotate-180" : ""}`} />
                                </button>

                                {showLoginMenu && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowLoginMenu(false)} />
                                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in slide-in-from-top-2">
                                            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-100">
                                                <h3 className="text-gray-900 font-bold text-sm">Choose your portal</h3>
                                                <p className="text-gray-500 text-xs mt-0.5">Select your role to continue</p>
                                            </div>
                                            <div className="p-2">
                                                {loginOptions.map((option, index) => (
                                                    <Link
                                                        key={index}
                                                        to={option.link}
                                                        onClick={() => setShowLoginMenu(false)}
                                                        className="block p-3 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-11 h-11 ${option.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}>
                                                                <option.icon className="w-5 h-5" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-gray-900 text-sm group-hover:text-red-600 transition-colors">
                                                                    {option.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-500">{option.description}</p>
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Register CTA */}
                            <Link
                                to="/register"
                                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-red-500/30 hover:scale-105 transition-all duration-200"
                            >
                                Get Started Free
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 rounded-lg"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen
                                ? <X className={`w-6 h-6 ${scrolled ? "text-gray-900" : "text-white"}`} />
                                : <Menu className={`w-6 h-6 ${scrolled ? "text-gray-900" : "text-white"}`} />
                            }
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="md:hidden mt-4 bg-white rounded-2xl shadow-2xl p-4 border border-gray-100">
                            <div className="space-y-2">
                                {loginOptions.map((option, index) => (
                                    <Link
                                        key={index}
                                        to={option.link}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-all"
                                    >
                                        <div className={`w-10 h-10 ${option.color} rounded-xl flex items-center justify-center text-white`}>
                                            <option.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">{option.title}</h4>
                                            <p className="text-xs text-gray-500">{option.description}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                            <Link
                                to="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="mt-3 block text-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold text-sm"
                            >
                                Register Now
                            </Link>
                        </div>
                    )}
                </div>
            </header>

            {/* ===== HERO SECTION ===== */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Village Background Image */}
                <img
                    src="/image.png"
                    alt="Indian village landscape"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Dark Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-900/70 to-gray-950/90"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-8 animate-fade-in">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                        <span className="text-gray-300 text-sm font-medium">Trusted by 10,000+ citizens across India</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6">
                        <span className="block">Your District,</span>
                        <span className="block mt-2">
                            <span className="bg-gradient-to-r from-red-400 via-red-500 to-amber-500 bg-clip-text text-transparent">
                                Your Voice
                            </span>
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Report road issues, connect with your MLA, and track resolutions in real-time.
                        Together, let's build better districts — one report at a time.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                        <Link
                            to="/register"
                            className="group px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 flex items-center gap-3"
                        >
                            Get Started — It's Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300"
                        >
                            Already a member? Login
                        </Link>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div
                                    key={index}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                                >
                                    <Icon className="w-6 h-6 text-red-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                    <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                        <AnimatedCounter target={stat.value.replace(/[^0-9]/g, "")} suffix={stat.value.includes("+") ? "+" : ""} />
                                    </div>
                                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
                        <div className="w-1.5 h-3 bg-white/40 rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-full mb-4">
                            <Zap className="w-4 h-4 text-red-500" />
                            <span className="text-red-600 text-sm font-semibold">Powerful Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Everything you need to
                            <br />
                            <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                                fix your district
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            From reporting potholes to tracking MLA responses — we've built the complete citizen engagement toolkit.
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className="group relative bg-white rounded-3xl p-8 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                >
                                    {/* Gradient accent on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.03] rounded-3xl transition-opacity duration-500`}></div>

                                    <div className={`w-14 h-14 ${feature.lightBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-gray-400 group-hover:text-red-500 transition-colors">
                                        <span>Learn more</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mb-4">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="text-amber-600 text-sm font-semibold">Simple Process</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            How it works
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Four simple steps to make your district a better place
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            return (
                                <div key={index} className="relative group">
                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-red-200 to-transparent"></div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-500/20 group-hover:scale-110 group-hover:shadow-red-500/40 transition-all duration-300">
                                            <Icon className="w-10 h-10 text-white" />
                                        </div>
                                        <div className="text-xs font-black text-red-500 tracking-widest uppercase mb-2 text-center">
                                            Step {step.step}
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{step.title}</h3>
                                        <p className="text-gray-600 text-sm text-center leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
                            <Star className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-600 text-sm font-semibold">Testimonials</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Loved by citizens
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            See what people are saying about Fix My District
                        </p>
                    </div>

                    {/* Testimonial Cards */}
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                            {/* Decorative quote mark */}
                            <div className="absolute top-6 right-8 text-8xl font-serif text-red-100 leading-none select-none">"</div>

                            <div className="relative z-10">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                                    ))}
                                </div>

                                <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8">
                                    "{testimonials[activeTestimonial].text}"
                                </p>

                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-amber-500 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonials[activeTestimonial].avatar}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{testimonials[activeTestimonial].name}</p>
                                        <p className="text-sm text-gray-500">{testimonials[activeTestimonial].role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Dots */}
                            <div className="flex gap-2 justify-center mt-8">
                                {testimonials.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveTestimonial(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === activeTestimonial
                                            ? "w-8 bg-red-500"
                                            : "w-2 bg-gray-300 hover:bg-gray-400"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-24 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                        Ready to fix
                        <br />
                        <span className="bg-gradient-to-r from-red-400 to-amber-400 bg-clip-text text-transparent">
                            your district?
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                        Join thousands of citizens who are making their communities better, one report at a time.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="group px-10 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold text-lg shadow-2xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            Start Reporting Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/login"
                            className="px-10 py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-gray-950 border-t border-white/5 py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">Fix My District</h1>
                                <p className="text-xs text-gray-500">Citizen Engagement Platform</p>
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex gap-8 text-sm text-gray-500">
                            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
                            <Link to="/mla/login" className="hover:text-white transition-colors">MLA Portal</Link>
                        </div>

                        {/* Copyright */}
                        <p className="text-xs text-gray-600">
                            &copy; {new Date().getFullYear()} Fix My District. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
