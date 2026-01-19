import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./utils/fixLeafletIcon";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import AuthProvider from "@/context/AuthProvider";
import CityProvider from "@/context/CityProvider";

import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CityProvider>
          <App />
        </CityProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
