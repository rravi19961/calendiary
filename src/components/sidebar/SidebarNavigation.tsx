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

interface SidebarNavigationProps {
  onNewEntry?: () => void;
}

const navigationItems = [
  { title: "Home", icon: Home, path: "/" },
  { title: "Daily Reflections", icon: Award, path: "/days-review" },
  { title: "Profile", icon: User, path: "/profile" },
  { title: "Settings", icon: Settings, path: "/preferences" },
];

export function SidebarNavigation({ onNewEntry }: SidebarNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  return (
    <div className="flex flex-col h-full">
      <SidebarMenu className="space-y-2">
        {navigationItems.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              tooltip={state === "collapsed" ? item.title : undefined}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full py-3 text-base transition-colors text-calendiary-primary",
                location.pathname === item.path 
                  ? "bg-calendiary-primary text-white hover:bg-calendiary-primary/90"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <div className="mt-6 px-4">
        <button
          onClick={onNewEntry}
          className="w-full h-20 bg-calendiary-primary hover:bg-calendiary-hover text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-semibold text-lg"
        >
          <Plus className="h-6 w-6" />
          New Entry
        </button>
      </div>
    </div>
  );
}