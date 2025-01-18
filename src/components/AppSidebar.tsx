import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Award, User, Settings, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Daily Reflections", icon: Award, path: "/days-review" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/preferences" },
];

interface Profile {
  username: string | null;
  avatar_url: string | null;
}

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { toast } = useToast();
  const { toggleSidebar, state } = useSidebar();
  const [profile, setProfile] = useState<Profile>({ username: null, avatar_url: null });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

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
    <Sidebar className="border-r">
      <div className="flex items-center justify-between p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="hover:bg-transparent"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <SidebarHeader className="px-4 py-2">
        <button 
          onClick={() => navigate("/")}
          className={cn(
            "w-full flex justify-center items-center hover:opacity-80 transition-opacity",
            state === "collapsed" ? "px-2" : "px-4"
          )}
        >
          <img 
            src="/lovable-uploads/02591592-bfe3-4424-b997-ae6fbecba899.png" 
            alt="Calendiary Logo" 
            className="h-12 w-auto"
          />
        </button>
        <div className="mt-6 flex flex-col items-center space-y-2">
          <Avatar className={cn(
            "transition-all duration-200",
            state === "collapsed" ? "h-8 w-8" : "h-16 w-16"
          )}>
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>
              {profile.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          {state !== "collapsed" && (
            <p className="text-sm font-medium text-foreground">
              {profile.username || user?.email?.split("@")[0] || "User"}
            </p>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={state === "collapsed" ? item.title : undefined}
                    isActive={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "w-full py-2 transition-colors",
                      location.pathname === item.path 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-muted"
                    )}
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
      <SidebarFooter className="p-4">
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full"
        >
          <LogOut className="h-5 w-5 mr-2" />
          {state !== "collapsed" && <span>Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}