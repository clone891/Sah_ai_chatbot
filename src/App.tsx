import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { AuthProvider, useAuth } from "@/context/AuthContext";

// Import all pages
import ChatPage from "./pages/ChatPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmergencyPage from "./pages/EmergencyPage";
import ProgressPage from "./pages/ProgressPage";
import BookingPage from "./pages/BookingPage";
import WellnessPage from "./pages/WellnessPage";
import SupportPage from "./pages/SupportPage";
import HelpPage from "./pages/HelpPage";
import SummaryPage from "./pages/SummaryPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider defaultTheme="light" storageKey="mental-health-theme">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-screen w-full"
        >
          <BrowserRouter>
            <AuthProvider>
              <Layout>
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="/emergency" element={<RequireAuth><EmergencyPage /></RequireAuth>} />
                  <Route path="/progress" element={<RequireAuth><ProgressPage /></RequireAuth>} />
                  <Route path="/booking" element={<RequireAuth><BookingPage /></RequireAuth>} />
                  <Route path="/wellness" element={<RequireAuth><WellnessPage /></RequireAuth>} />
                  <Route path="/support" element={<RequireAuth><SupportPage /></RequireAuth>} />
                  <Route path="/help" element={<RequireAuth><HelpPage /></RequireAuth>} />
                  <Route path="/summary" element={<RequireAuth><SummaryPage /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </AuthProvider>
          </BrowserRouter>
        </motion.div>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
