import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, BookOpen, Award, User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";

const navigationItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Calendar", icon: Calendar, path: "/calendar" },
  { title: "Today's Entry", icon: BookOpen, path: "/entry" },
  { title: "Best Days", icon: Award, path: "/best-days" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/preferences" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "See you next time!",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <button 
          onClick={() => navigate("/")}
          className="w-full flex justify-center items-center hover:opacity-80 transition-opacity"
        >
          <img 
            src="/lovable-uploads/8f33fce6-960e-4f1f-894a-0e2a12c49357.png" 
            alt="Calendiary Logo" 
            className="h-16 w-auto"
          />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Logout"
                  onClick={handleLogout}
                  variant="outline"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}