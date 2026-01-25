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

import TravelRequests from "@/Pages/Private/TravelRequest";
import RoadReports from "@/Pages/Private/RoadReportsfile/RoadReports";
import Profile from "@/Pages/Private/Profile";

import MyHistory from "@/Pages/Private/MyHistory";
import MyRoadReports from "@/Pages/Private/MyRoadReports";
import MyHelpRequests from "@/Pages/Private/MyHelpRequests";
import MyTravelRequests from "@/Pages/Private/MyTravelRequests";

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

        {/* Other modules */}
        <Route path="travel-requests" element={<TravelRequests />} />
        <Route path="road-reports" element={<RoadReports />} />

        
        <Route path="travel-requests" element={<TravelRequests />} />
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
