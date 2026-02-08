import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

/* Public pages */
import LandingPage from "@/Pages/Public/LandingPage";
import Login from "@/Pages/Public/Login";
import Register from "@/Pages/Public/Register";

/* Dashboard layout */
import Dashboard from "@/Pages/Private/DashBoard";
import DashboardHome from "@/Pages/Private/DashBoardHome";

/* Dashboard pages */
import HelpRequests from "@/Pages/Private/HelpRequests/HelpRequest";
import HelpRequestDetails from "@/Pages/Private//HelpRequests/HelpRequestDetails";

import TravelRequests from "@/Pages/Private/TravelRequest";
import RoadReports from "@/Pages/Private/RoadReportsfile/RoadReports";
import RoadReportsMenu from "@/Pages/Private/RoadReportsfile/RoadReportsMenu";
import CreateRoadReportPage from "@/Pages/Private/RoadReportsfile/CreateRoadReportPage";
import MyDistrictReports from "@/Pages/Private/RoadReportsfile/MyDistrictReports";
import Profile from "@/Pages/Private/Profile";

import MyHistory from "@/Pages/Private/MyHistory";
import MyRoadReports from "@/Pages/Private/MyRoadReports";
import MyHelpRequests from "@/Pages/Private/MyHelpRequests";
import MyTravelRequests from "@/Pages/Private/MyTravelRequests";

/* Admin pages */
import AdminLogin from "@/Pages/Admin/AdminLogin";
import AdminDashboard from "@/Pages/Admin/AdminDashboard";
import AdminHome from "@/Pages/Admin/AdminHome";
import MLAApplications from "@/Pages/Admin/MLAApplications";

/* MLA pages */
import MLALogin from "@/Pages/MLA/MLALogin";
import MLARegister from "@/Pages/MLA/MLARegister";
import MLADashboard from "@/Pages/MLA/MLADashboard";
import MLADashboardHome from "@/Pages/MLA/MLADashboardHome";
import MLARoadReports from "@/Pages/MLA/MLARoadReports";
import MLADistrictReports from "@/Pages/MLA/MLADistrictReports";


const App = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* MLA ROUTES */}
      <Route path="/mla/login" element={<MLALogin />} />
      <Route path="/mla/register" element={<MLARegister />} />

      {/* MLA DASHBOARD - Only accessible by MLAs */}
      <Route
        path="/mla/dashboard"
        element={
          <ProtectedRoute allowedRoles={["mla"]}>
            <MLADashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<MLADashboardHome />} />
        <Route path="district-reports" element={<MLADistrictReports />} />
        <Route path="road-reports" element={<MLARoadReports />} />
      </Route>

      {/* ADMIN ROUTES - Only accessible by users with role="admin" */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" />} />
        <Route path="dashboard" element={<AdminHome />} />
        <Route path="mla-applications" element={<MLAApplications />} />
      </Route>

      {/* PRIVATE DASHBOARD ROUTES - Accessible by citizens and MLAs */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["citizen", "mla"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />

        {/* Help Requests */}
        <Route path="help-requests" element={<HelpRequests />} />

        {/* Other modules */}
        <Route path="travel-requests" element={<TravelRequests />} />

        {/* Road Reports */}
        <Route path="road-reports" element={<RoadReportsMenu />} />
        <Route path="road-reports/create" element={<CreateRoadReportPage />} />
        <Route path="road-reports/my-district" element={<MyDistrictReports />} />
        <Route path="road-reports/all" element={<RoadReports />} />


        <Route path="profile" element={<Profile />} />
        <Route path="my-history" element={<MyHistory />} />
        <Route path="my-history/road-reports" element={<MyRoadReports />} />
        <Route path="my-history/help-requests" element={<MyHelpRequests />} />
        <Route path="my-history/travel-requests"
          element={<MyTravelRequests />}
        />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;

