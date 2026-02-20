import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";


import logo from "@/assets/logo.png";
import heroCar from "@/assets/illustration.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      <header className="flex items-center justify-between px-10 py-5 border-b">

        <div className="flex items-center gap-3">

          <img
            src={logo}
            alt="Fix My District Logo"
            className="w-10 h-10 object-contain"
          />

          <span className="text-2xl font-bold tracking-tight">
            FIX MY DISTRICT
          </span>
        </div>


        <div className="flex gap-3">
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>

          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-10 py-20 gap-10">
        {/* Left Content */}
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            A Smarter Way <br /> to Travel Safely
          </h1>

          <p className="mt-5 text-lg text-gray-600">
            Fix My District helps citizens report road issues, request help,
            and stay updated with real-time travel alerts — powered by the
            community.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>

            <Link to="/login">
              <Button size="lg" variant="outline">
                Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image / Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          {/* ✅ USE imported hero image */}
          <img
            src={heroCar}
            alt="Travel illustration"
            className="max-w-md w-full"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="px-10 py-16 bg-gray-50">
        <div className="grid gap-6 md:grid-cols-3 text-center">
          <div className="p-6 rounded-xl bg-white shadow">
            <h3 className="text-xl font-semibold">🚧 Road Reports</h3>
            <p className="mt-2 text-gray-600">
              Identify damaged roads and avoid risky routes.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow">
            <h3 className="text-xl font-semibold">🚨 Help Requests</h3>
            <p className="mt-2 text-gray-600">
              Get help for petrol, breakdown, or emergencies.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white shadow">
            <h3 className="text-xl font-semibold">📰 Travel Alerts</h3>
            <p className="mt-2 text-gray-600">
              Stay informed about accidents and traffic updates.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Fix My District. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
