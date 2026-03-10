import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

/* ================================================
   LOADING SPINNER — shown while lazy chunks load
   ================================================ */
const PageLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
    <div className="relative">
      <div className="w-14 h-14 border-4 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
    </div>
    <p className="text-sm text-gray-400 font-medium animate-pulse">Loading…</p>
  </div>
);

/* ================================================
   LAZY IMPORTS — each page becomes its own chunk
   ================================================ */

/* Public pages */
const LandingPage = lazy(() => import("@/Pages/Public/LandingPage"));
const Login = lazy(() => import("@/Pages/Public/Login"));
const Register = lazy(() => import("@/Pages/Public/Register"));
const GovernmentOfficialRegister = lazy(() => import("@/Pages/Public/GovernmentOfficialRegister"));

/* Dashboard layout */
const Dashboard = lazy(() => import("@/Pages/Private/DashBoard"));
const DashboardHome = lazy(() => import("@/Pages/Private/DashBoardHome"));

/* Dashboard pages */
const HelpRequests = lazy(() => import("@/Pages/Private/HelpRequests/HelpRequest"));
const HelpRequestDetails = lazy(() => import("@/Pages/Private//HelpRequests/HelpRequestDetails"));

const RoadReports = lazy(() => import("@/Pages/Private/RoadReportsfile/RoadReports"));
const RoadReportsMenu = lazy(() => import("@/Pages/Private/RoadReportsfile/RoadReportsMenu"));
const CreateRoadReportPage = lazy(() => import("@/Pages/Private/RoadReportsfile/CreateRoadReportPage"));
const MyDistrictReports = lazy(() => import("@/Pages/Private/RoadReportsfile/MyDistrictReports"));
const Profile = lazy(() => import("@/Pages/Private/Profile"));

const MyHistory = lazy(() => import("@/Pages/Private/MyHistory"));
const MyRoadReports = lazy(() => import("@/Pages/Private/MyRoadReports"));
const MyHelpRequests = lazy(() => import("@/Pages/Private/MyHelpRequests"));

/* Admin pages */
const AdminLogin = lazy(() => import("@/Pages/Admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/Pages/Admin/AdminDashBoard"));
const AdminHome = lazy(() => import("@/Pages/Admin/AdminHome"));
const MLAApplications = lazy(() => import("@/Pages/Admin/MLAApplications"));
const AdminUsers = lazy(() => import("@/Pages/Admin/AdminUsers"));
const AdminSettings = lazy(() => import("@/Pages/Admin/AdminSettings"));

/* MLA pages */
const MLALogin = lazy(() => import("@/Pages/MLA/MLALogin"));
const MLARegister = lazy(() => import("@/Pages/MLA/MLARegister"));
const MLADashboard = lazy(() => import("@/Pages/MLA/MLADashboard"));
const MLADashboardHome = lazy(() => import("@/Pages/MLA/MLADashboardHome"));
const MLARoadReports = lazy(() => import("@/Pages/MLA/MLARoadReports"));
const MLADistrictReports = lazy(() => import("@/Pages/MLA/MLADistrictReports"));
const MLAProfile = lazy(() => import("@/Pages/MLA/MLAProfile"));
const MLAHelpRequests = lazy(() => import("@/Pages/MLA/MLAHelpRequests"));

/* Official pages */
const OfficialLayout = lazy(() => import("@/Pages/Official/OfficialLayout"));
const OfficialDashboard = lazy(() => import("@/Pages/Official/OfficialDashboard"));
const OfficialWorkOrders = lazy(() => import("@/Pages/Official/OfficialWorkOrders"));
const OfficialProfile = lazy(() => import("@/Pages/Official/OfficialProfile"));


const App = () => {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/government-register" element={<GovernmentOfficialRegister />} />

          {/* MLA ROUTES (kept for backward compatibility) */}
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
            <Route path="help-requests" element={<MLAHelpRequests />} />
            <Route path="profile" element={<MLAProfile />} />
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
            <Route path="users" element={<AdminUsers />} />
            <Route path="mla-applications" element={<MLAApplications />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* OFFICIAL ROUTES - Only accessible by government officials */}
          <Route
            path="/official/dashboard"
            element={
              <ProtectedRoute allowedRoles={["official"]}>
                <OfficialLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OfficialDashboard />} />
            <Route path="work-orders" element={<OfficialWorkOrders />} />
            <Route path="profile" element={<OfficialProfile />} />
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
            <Route path="help-requests/:id" element={<HelpRequestDetails />} />

            {/* Road Reports */}
            <Route path="road-reports" element={<RoadReportsMenu />} />
            <Route path="road-reports/create" element={<CreateRoadReportPage />} />
            <Route path="road-reports/my-district" element={<MyDistrictReports />} />
            <Route path="road-reports/all" element={<RoadReports />} />


            <Route path="profile" element={<Profile />} />
            <Route path="my-history" element={<MyHistory />} />
            <Route path="my-history/road-reports" element={<MyRoadReports />} />
            <Route path="my-history/help-requests" element={<MyHelpRequests />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
      <Toaster position="top-right" />
    </>
  );
};

export default App;
