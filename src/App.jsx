import { Routes, Route, Navigate } from "react-router-dom";

/* Public pages */
import Landing from "@/Pages/Public/Landing";
import Login from "@/Pages/Public/Login";
import Register from "@/Pages/Public/Register";

/* Dashboard layout */
import Dashboard from "@/Pages/Private/DashBoard";
import DashboardHome from "@/Pages/Private/DashBoardHome";

/* Dashboard pages */
import HelpRequests from "@/Pages/Private/HelpRequests/HelpRequest";
import HelpRequestDetails from "@/Pages/Private//HelpRequests/HelpRequestDetails";
import MyHelpRequests from "@/Pages/Private//HelpRequests/MyHelpRequests";
import TravelRequests from "@/Pages/Private/TravelRequest";
import RoadReports from "@/Pages/Private/RoadReportsfile/CreateRoadReport";
import Profile from "@/Pages/Private/Profile";

const App = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* PRIVATE DASHBOARD ROUTES */}
      <Route path="/dashboard" element={<Dashboard />}>
        {/* Dashboard Home */}
        <Route index element={<DashboardHome />} />

        {/* Help Requests */}
        <Route path="help-requests" element={<HelpRequests />} />
        <Route path="help-requests/:id" element={<HelpRequestDetails />} />

        {/* My Requests */}
        <Route path="my-requests" element={<MyHelpRequests />} />

        {/* Other modules */}
        <Route path="travel-requests" element={<TravelRequests />} />
        <Route path="road-reports" element={<RoadReports />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
