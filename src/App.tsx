import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";

// Import all pages
import ChatPage from "./pages/ChatPage";
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
            <Layout>
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/booking" element={<BookingPage />} />
                <Route path="/wellness" element={<WellnessPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/help" element={<HelpPage />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </motion.div>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
