import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Owners from "./pages/Owners";
import Pets from "./pages/Pets";
import Visits from "./pages/Visits";
import Vets from "./pages/Vets";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes - All authenticated users */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Admin and Doctor can access */}
            <Route path="/owners" element={
              <ProtectedRoute allowedRoles={["admin", "doctor"]}>
                <Owners />
              </ProtectedRoute>
            } />
            
            <Route path="/pets" element={
              <ProtectedRoute allowedRoles={["admin", "doctor"]}>
                <Pets />
              </ProtectedRoute>
            } />
            
            <Route path="/visits" element={
              <ProtectedRoute>
                <Visits />
              </ProtectedRoute>
            } />
            
            {/* Admin only */}
            <Route path="/vets" element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Vets />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
