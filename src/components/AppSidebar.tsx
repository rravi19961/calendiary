import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Mail, 
  Bell, 
  ShoppingBag,
  Settings, 
  User, 
  Clock,
  Plus,
  LogOut
} from "lucide-react";
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
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/" },
  { title: "Calendar", icon: Calendar, path: "/days-review" },
  { title: "Mail", icon: Mail, path: "/mail", badge: 4 },
  { title: "Notifications", icon: Bell, path: "/notifications" },
  { title: "Sales", icon: ShoppingBag, path: "/sales" },
];

const serviceItems = [
  { title: "Figma", imagePath: "/figma-icon.png" },
  { title: "Flutter", imagePath: "/flutter-icon.png" },
  { title: "Slack", imagePath: "/slack-icon.png" },
];

const settingsItems = [
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/preferences" },
  { title: "Activity", icon: Clock, path: "/activity" },
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
    <Sidebar className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <SidebarHeader className="p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/37f6062d-15f0-4f90-a572-df6b0f6b7b14.png"
              alt="Profile" 
              className="h-16 w-16 rounded-full border-2 border-white shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="text-center">
            <h3 className="font-medium">Good Day,</h3>
            <p className="text-sm text-muted-foreground">Sarah Akiyama</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <span>Menu</span>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {navigationItems.length}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "relative py-2 px-3",
                      location.pathname === item.path && "bg-blue-500 text-white"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    {'badge' in item && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full px-1">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center">
            <span>Services</span>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
              {serviceItems.length}
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-4 gap-2 p-2">
              {serviceItems.map((service) => (
                <button
                  key={service.title}
                  className="aspect-square rounded-xl bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={service.imagePath}
                    alt={service.title}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
              <button className="aspect-square rounded-xl bg-white dark:bg-gray-800 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Plus className="w-full h-full text-gray-400" />
              </button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    className="py-2"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-4">
        <button className="w-full flex flex-col items-center gap-2 p-4 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-colors">
          <Plus className="h-6 w-6" />
          <span className="text-sm font-medium">Create new task</span>
          <span className="text-xs opacity-75">Or use invite link</span>
        </button>
        
        <SidebarMenuButton
          tooltip="Logout"
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-md py-2 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}