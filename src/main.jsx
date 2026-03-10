import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import AuthProvider from "@/context/AuthProvider";
import CityProvider from "@/context/CityProvider";

import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes — avoid redundant refetches
      retry: 1,                  // fail fast instead of 3 retries
      refetchOnWindowFocus: false, // don't refetch when user tabs back
    },
  },
});

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
