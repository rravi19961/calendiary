import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Award, User, Settings, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigationItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Daily Reflections", icon: Award, path: "/days-review" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/preferences" },
];

interface SidebarNavigationProps {
  onNewEntry: () => void;
}

export function SidebarNavigation({ onNewEntry }: SidebarNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  return (
    <SidebarMenu className="space-y-2">
      <SidebarMenuItem>
        <Button
          onClick={onNewEntry}
          className={cn(
            "w-full py-6 text-base bg-calendiary-primary hover:bg-calendiary-hover text-white transition-all",
            state === "collapsed" && "w-10 h-10 p-0"
          )}
        >
          <Plus className={cn("h-5 w-5", state !== "collapsed" && "mr-2")} />
          {state !== "collapsed" && <span>New Entry</span>}
        </Button>
      </SidebarMenuItem>

      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton
                  isActive={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full py-3 text-base transition-colors text-calendiary-primary group",
                    location.pathname === item.path 
                      ? "bg-calendiary-primary text-white hover:bg-calendiary-hover"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="transition-opacity duration-200 ml-2">
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