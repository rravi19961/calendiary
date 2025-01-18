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
      <SidebarMenuItem className="mb-6">
        <SidebarMenuButton
          tooltip={state === "collapsed" ? "New Entry" : undefined}
          onClick={onNewEntry}
          className="w-full py-4 text-lg font-semibold bg-calendiary-primary text-white hover:bg-calendiary-hover transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>New Entry</span>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {navigationItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            tooltip={state === "collapsed" ? item.title : undefined}
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "w-full py-3 text-lg transition-colors text-calendiary-primary",
              location.pathname === item.path 
                ? "bg-calendiary-primary text-white hover:bg-calendiary-hover"
                : "hover:bg-muted"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}