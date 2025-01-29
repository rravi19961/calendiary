import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Award, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Daily Reflections", icon: Award, path: "/daily-reflections" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/preferences" },
];

export function SidebarNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const handleNavigation = (path: string) => {
    console.log("Navigating to:", path);
    navigate(path);
  };

  return (
    <SidebarMenu className="space-y-2">
      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  isActive={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full py-3 text-base transition-colors hover:bg-muted",
                    location.pathname === item.path && "bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className={cn(
                    "ml-2",
                    state === "collapsed" ? "opacity-0" : "opacity-100",
                    "transition-opacity duration-200"
                  )}>
                    {item.title}
                  </span>
                </SidebarMenuButton>
              </TooltipTrigger>
              {state === "collapsed" && (
                <TooltipContent side="right">
                  <p>{item.title}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}