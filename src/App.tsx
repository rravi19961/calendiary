import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import Index from "@/webapp/pages/Index";
import Login from "@/webapp/pages/Login";
import Profile from "@/webapp/pages/Profile";
import DailyReflections from "@/webapp/pages/DailyReflections";
import Preferences from "@/webapp/pages/Preferences";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppSidebar } from "./components/AppSidebar";
import EntryModal from "./components/EntryModal";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar 
        onNewEntry={() => {
          setModalKey(prev => prev + 1);
          setIsModalOpen(true);
        }} 
      />
      <main className="flex-1 p-6">
        {children}
      </main>
      <EntryModal
        key={modalKey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={new Date()}
      />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Index />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/daily-reflections"
                element={
                  <ProtectedRoute>
                    <DailyReflections />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/preferences"
                element={
                  <ProtectedRoute>
                    <Preferences />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SidebarProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;